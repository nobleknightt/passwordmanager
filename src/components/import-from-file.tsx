import { useState, useEffect } from "react"
import { Eye, EyeOff, Upload } from "lucide-react"
import { decryptWith_AES_GCM, base64ToUint8Array } from "@/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RecordItem } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

interface ImportFromFileProps {
  records?: RecordItem[]
  setRecords: (records: RecordItem[]) => void
  password?: string
  setPassword?: (password: string) => void
  onImportSuccess?: (count: number) => void
}

function ImportFromFile({ records = [], setRecords, password = "", setPassword, onImportSuccess }: ImportFromFileProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [inputPassword, setInputPassword] = useState(password)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (password) {
      setInputPassword(password)
    }
  }, [password])

  const handleUpload = () => {
    if (!file) {
      setError("Please select a file.")
      return
    }
    if (!inputPassword) {
      setError("Please enter the password.")
      return
    }
    setError("")

    const reader = new FileReader()
    reader.addEventListener('load', (event) => {
      try {
        const fileContent = event.target?.result as string
        const ciphertextBytes = base64ToUint8Array(fileContent)
        const encoder = new TextEncoder()
        const passwordBytes = encoder.encode(inputPassword)

        decryptWith_AES_GCM(ciphertextBytes, passwordBytes)
          .then(function (plaintextBytes) {
            const decoder = new TextDecoder()
            const plaintext = decoder.decode(plaintextBytes)
            const parsedRecords = JSON.parse(plaintext)
            if (!Array.isArray(parsedRecords)) {
              throw new Error("Invalid file format.")
            }
            
            // Merge imported records with existing ones cleanly
            const existingIds = new Set(records.map((r) => r.id))
            const newItems = parsedRecords.map((item, idx) => ({
              ...item,
              id: existingIds.has(item.id) ? Date.now() + idx : (item.id || Date.now() + idx)
            }))

            setRecords([...records, ...newItems])
            if (setPassword) setPassword(inputPassword)
            setIsOpen(false)
            if (onImportSuccess) onImportSuccess(parsedRecords.length)
          })
          .catch((err) => {
            console.error(err)
            setError("Wrong password or corrupted file.")
          })
      } catch (err) {
        console.error(err)
        setError("Invalid file format.")
      }
    })
    reader.readAsText(file)
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="default"
        className="w-full sm:w-auto justify-center gap-1.5 font-medium cursor-pointer"
        onClick={() => {
          setError("")
          setIsOpen(true)
        }}
      >
        <Upload size={15} />
        Import
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] max-w-[420px] p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-popover text-popover-foreground shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-bold tracking-tight">Import Passwords</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Select your backup file and enter your password to merge passwords with your list.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="import-file" className="text-xs font-semibold text-foreground/80">Encrypted File</label>
              <Input
                id="import-file"
                type="file"
                onChange={(event) => setFile(event.target.files ? event.target.files[0] : null)}
                className="cursor-pointer file:cursor-pointer text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="import-password" className="text-xs font-semibold text-foreground/80">Password</label>
              <div className="relative flex items-center">
                <Input
                  id="import-password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter password"
                  value={inputPassword}
                  onChange={(event) => setInputPassword(event.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground p-1 transition cursor-pointer"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-xl border border-destructive/20 font-medium">
              {error}
            </p>
          )}

          <DialogFooter className="mt-4 flex flex-row gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="default" onClick={handleUpload}>
              Import File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { ImportFromFile }
