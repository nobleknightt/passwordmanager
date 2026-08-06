import { useState, useEffect } from "react"
import { AddRecord } from "@/components/add-record"
import { ImportFromFile } from "@/components/import-from-file"
import { ExportToFile } from "@/components/export-to-file"
import { Records } from "@/components/records"
import { ModeToggle } from "@/components/mode-toggle"
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useStore } from "@/store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

function App() {
  const records = useStore((state) => state.records)
  const setRecords = useStore((state) => state.setRecords)
  const password = useStore((state) => state.password)
  const isUnlocked = useStore((state) => state.isUnlocked)
  const hasStoredData = useStore((state) => state.hasStoredData)
  const initStore = useStore((state) => state.initStore)
  const unlock = useStore((state) => state.unlock)
  const lock = useStore((state) => state.lock)
  const clearStorage = useStore((state) => state.clearStorage)

  // Unlock Screen State
  const [inputPassword, setInputPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isConfirmingReset, setIsConfirmingReset] = useState(false)

  // Set Password Modal State (when locking without an existing password)
  const [isSetPassOpen, setIsSetPassOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [setPassError, setSetPassError] = useState("")

  // Initialize store status on mount
  useEffect(() => {
    initStore()
  }, [initStore])

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputPassword) {
      setError("Please enter your password.")
      return
    }
    setError("")
    setLoading(true)
    try {
      await unlock(inputPassword)
      setInputPassword("")
      toast.success("Unlocked successfully.")
    } catch {
      setError("Invalid password.")
    } finally {
      setLoading(false)
    }
  }

  const handleLockClick = () => {
    if (!password) {
      setSetPassError("")
      setNewPassword("")
      setIsSetPassOpen(true)
    } else {
      lock()
      toast.info("Database Locked.")
    }
  }

  const handleSetPasswordAndLock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword) {
      setSetPassError("Please enter a password.")
      return
    }
    if (newPassword.length < 4) {
      setSetPassError("Password must be at least 4 characters.")
      return
    }
    useStore.setState({ password: newPassword })
    await setRecords(records)
    setIsSetPassOpen(false)
    lock()
    toast.success("Encrypted with password and locked.")
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center font-sans tracking-tight bg-muted/40 text-foreground p-2 sm:p-4 md:p-8">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "'Google Sans', system-ui, sans-serif"
          }
        }}
      />

      <div className="h-[92vh] sm:h-[90vh] min-h-[480px] max-w-4xl w-full flex flex-col gap-3 sm:gap-4 bg-popover text-popover-foreground border border-border rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 sm:pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="min-w-0 truncate">
              <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight leading-normal py-0.5 truncate">Password Manager</h1>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <ModeToggle />

            {isUnlocked && (hasStoredData || records.length > 0) && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleLockClick}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                aria-label="Lock"
                title="Lock & Encrypt"
              >
                <Lock size={18} />
              </Button>
            )}
          </div>
        </div>

        {/* Locked Screen View */}
        {hasStoredData && !isUnlocked ? (
          <div className="grow flex flex-col items-center justify-center py-6 px-2 text-center max-w-sm mx-auto w-full">
            <div className="p-3 rounded-2xl sm:rounded-3xl bg-primary/10 text-primary mb-3 shadow-inner">
              <ShieldCheck size={32} className="sm:w-10 sm:h-10" />
            </div>
            <h2 className="text-base sm:text-xl font-bold tracking-tight">Unlock App</h2>
            <p className="text-xs text-muted-foreground mt-1 mb-4 sm:mb-6">
              Enter your password to decrypt your saved passwords.
            </p>

            <form onSubmit={handleUnlockSubmit} className="w-full flex flex-col gap-2.5">
              {error && (
                <p className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-xl border border-destructive/20 font-medium">
                  {error}
                </p>
              )}

              <div className="relative flex items-center">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="pr-10 text-xs sm:text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-muted-foreground hover:text-foreground transition cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <Button type="submit" variant="default" className="w-full gap-2 shadow-md cursor-pointer" disabled={loading}>
                <KeyRound size={16} /> {loading ? "Decrypting..." : "Unlock"}
              </Button>
            </form>

            <div className="mt-4 sm:mt-6">
              {isConfirmingReset ? (
                <div className="flex items-center justify-center gap-2 animate-in fade-in duration-150">
                  <Button
                    type="button"
                    variant="destructive"
                    size="xs"
                    onClick={() => {
                      clearStorage()
                      setIsConfirmingReset(false)
                      toast.success("Local data reset.")
                    }}
                    className="cursor-pointer text-xs font-semibold"
                  >
                    Confirm reset all data?
                  </Button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingReset(false)}
                    className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingReset(true)}
                  className="text-xs text-muted-foreground hover:text-destructive underline cursor-pointer"
                >
                  Reset local data
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Main Unlocked App View */
          <>
            <div className="flex flex-col gap-2 shrink-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <AddRecord
                  records={records}
                  setRecords={setRecords}
                  onRecordAdded={(title) => toast.success(`Added "${title}"`)}
                />
                <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center">
                  <ImportFromFile
                    records={records}
                    setRecords={setRecords}
                    password={password}
                    onImportSuccess={(count) => toast.success(`Imported ${count} passwords`)}
                  />
                  <ExportToFile
                    records={records}
                    password={password}
                    onExportSuccess={() => toast.success("Exported successfully")}
                  />
                </div>
              </div>
            </div>

            <Records records={records} setRecords={setRecords} />
          </>
        )}

        {/* Set Password Dialog (When locking for the first time) */}
        <Dialog open={isSetPassOpen} onOpenChange={setIsSetPassOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] max-w-[400px] p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-popover text-popover-foreground shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg font-bold tracking-tight">Set Password</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Create a password to protect and lock your passwords.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSetPasswordAndLock} className="flex flex-col gap-3 mt-2">
              {setPassError && (
                <p className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-xl border border-destructive/20 font-medium">
                  {setPassError}
                </p>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Password</label>
                <div className="relative flex items-center">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 text-muted-foreground hover:text-foreground transition cursor-pointer"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <DialogFooter className="mt-4 flex flex-row gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsSetPassOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="gap-1.5 cursor-pointer">
                  <Lock size={15} /> Lock
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}

export { App }
