import { create } from 'zustand'
import { RecordItem } from '@/types'
import {
  encryptWith_AES_GCM,
  decryptWith_AES_GCM,
  uint8ArrayToBase64,
  base64ToUint8Array
} from '@/utils'

const STORAGE_KEY = 'storage'
const FALLBACK_SECRET = 'LOCAL_SESSION_DEFAULT'

interface StoreState {
  records: RecordItem[]
  password: string
  isUnlocked: boolean
  hasStoredData: boolean
  
  initStore: () => Promise<void>
  unlock: (password: string) => Promise<void>
  lock: () => void
  addRecord: (newRecord: RecordItem) => Promise<void>
  updateRecord: (index: number, updatedRecord: RecordItem) => Promise<void>
  deleteRecord: (index: number) => Promise<void>
  setRecords: (records: RecordItem[]) => Promise<void>
  clearStorage: () => void
}

async function saveEncrypted(records: RecordItem[], password?: string): Promise<void> {
  const secretToUse = password && password.length > 0 ? password : FALLBACK_SECRET
  const fileContent = JSON.stringify(records)
  const encoder = new TextEncoder()
  const plaintextBytes = encoder.encode(fileContent)
  const passwordBytes = encoder.encode(secretToUse)

  const encryptedBytes = await encryptWith_AES_GCM(plaintextBytes, passwordBytes)
  const base64Encrypted = uint8ArrayToBase64(encryptedBytes)
  localStorage.setItem(STORAGE_KEY, base64Encrypted)
}

async function readEncrypted(password?: string): Promise<RecordItem[]> {
  const base64Data = localStorage.getItem(STORAGE_KEY)
  if (!base64Data) return []

  const secretToUse = password && password.length > 0 ? password : FALLBACK_SECRET
  const ciphertextBytes = base64ToUint8Array(base64Data)
  const encoder = new TextEncoder()
  const passwordBytes = encoder.encode(secretToUse)

  const plaintextBytes = await decryptWith_AES_GCM(ciphertextBytes, passwordBytes)
  const decoder = new TextDecoder()
  const jsonText = decoder.decode(plaintextBytes)
  const parsed = JSON.parse(jsonText)
  if (!Array.isArray(parsed)) {
    throw new Error('Invalid data format')
  }
  return parsed
}

export const useStore = create<StoreState>((set, get) => ({
  records: [],
  password: '',
  isUnlocked: true,
  hasStoredData: typeof window !== 'undefined' && !!localStorage.getItem(STORAGE_KEY),

  initStore: async () => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const decryptedRecords = await readEncrypted()
        set({ records: decryptedRecords, isUnlocked: true, hasStoredData: true })
      } catch {
        // Data is locked with a custom user password
        set({ records: [], isUnlocked: false, hasStoredData: true })
      }
    } else {
      set({ records: [], isUnlocked: true, hasStoredData: false })
    }
  },

  unlock: async (password: string) => {
    const decryptedRecords = await readEncrypted(password)
    set({
      records: decryptedRecords,
      password: password,
      isUnlocked: true,
      hasStoredData: true
    })
  },

  lock: () => {
    set({
      records: [],
      password: '',
      isUnlocked: false
    })
  },

  addRecord: async (newRecord: RecordItem) => {
    const { records, password } = get()
    const updated = [...records, { ...newRecord, id: Date.now() }]
    set({ records: updated, hasStoredData: true })
    await saveEncrypted(updated, password)
  },

  updateRecord: async (index: number, updatedRecord: RecordItem) => {
    const { records, password } = get()
    const updated = [...records]
    updated[index] = updatedRecord
    set({ records: updated })
    await saveEncrypted(updated, password)
  },

  deleteRecord: async (index: number) => {
    const { records, password } = get()
    const updated = records.filter((_, i) => i !== index)
    set({ records: updated })
    await saveEncrypted(updated, password)
  },

  setRecords: async (newRecords: RecordItem[]) => {
    const { password } = get()
    set({ records: newRecords, hasStoredData: true })
    await saveEncrypted(newRecords, password)
  },

  clearStorage: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({
      records: [],
      password: '',
      isUnlocked: true,
      hasStoredData: false
    })
  }
}))
