export interface RecordItem {
  id?: number | string
  website: string
  url?: string
  username?: string
  email?: string
  password?: string
  mobile?: string
  notes?: string
}

export type Theme = "dark" | "light" | "system"
