import { useState, useEffect, useRef } from "react"
import { Eye, EyeOff, Download } from "lucide-react"
import { encryptWith_AES_GCM, uint8ArrayToBase64 } from "@/utils"
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

interface ExportToFileProps {
  records: RecordItem[]
  password?: string
  setPassword?: (password: string) => void
  onExportSuccess?: () => void
}

function ExportToFile({ records, password = "", setPassword, onExportSuccess }: ExportToFileProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputPassword, setInputPassword] = useState(password)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [error, setError] = useState("")
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (password) {
      setInputPassword(password)
    }
  }, [password])

  const handleExport = () => {
    if (!inputPassword) {
      setError("Please enter a password.")
      return
    }
    setError("")

    const fileContent = JSON.stringify(records)
    const encoder = new TextEncoder()
    const plaintextBytes = encoder.encode(fileContent)
    const passwordBytes = encoder.encode(inputPassword)

    encryptWith_AES_GCM(plaintextBytes, passwordBytes)
      .then(function (IVSaltCiphertextBytes) {
        const base64IVSaltCiphertextBytes = uint8ArrayToBase64(IVSaltCiphertextBytes)
        const blob = new Blob([base64IVSaltCiphertextBytes], { type: 'application/octet-stream' })
        const url = URL.createObjectURL(blob)
        if (linkRef.current) {
          linkRef.current.href = url
          linkRef.current.download = `passwords_${new Date().toISOString().slice(0, 10)}.enc`
          linkRef.current.click()
        }
        setTimeout(() => URL.revokeObjectURL(url), 2000)
        if (setPassword) setPassword(inputPassword)
        setIsOpen(false)
        if (onExportSuccess) onExportSuccess()
      })
      .catch((err) => {
        console.error(err)
        setError("Export failed. Please try again.")
      })
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
        <Download size={15} />
        Export
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] max-w-[420px] p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-popover text-popover-foreground shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-bold tracking-tight">Export Passwords</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Save an encrypted backup file of your passwords.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 mt-2">
            <label htmlFor="export-password" className="text-xs font-semibold text-foreground/80">Password</label>
            <div className="relative flex items-center">
              <Input
                id="export-password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter password"
                value={inputPassword}
                onChange={(event) => setInputPassword(event.target.value)}
                className="pr-10"
                required
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

          {error && (
            <p role="alert" className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-xl border border-destructive/20 font-medium">
              {error}
            </p>
          )}

          <DialogFooter className="mt-4 flex flex-row gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="default" onClick={handleExport}>
              Download File
            </Button>
            <a ref={linkRef} className="hidden" aria-hidden="true"></a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { ExportToFile }
