import React, { useState } from "react"
import { ExternalLink, Copy, Eye, EyeOff, KeyRound, Check, Trash2, SlidersHorizontal, Undo2 } from "lucide-react"
import { generatePassword, copyToClipboard } from "@/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RecordItem } from "@/types"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

interface RecordFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (record: RecordItem) => void
  onDelete?: () => void
  initialRecord?: RecordItem | null
  title?: string
}

function RecordFormModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialRecord = null,
  title = "Password Details"
}: RecordFormModalProps) {
  const emptyRecord: RecordItem = {
    website: "",
    url: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
    notes: ""
  }

  const [record, setRecord] = useState<RecordItem>(() => initialRecord ? { ...emptyRecord, ...initialRecord } : emptyRecord)
  const [originalPassword] = useState<string>(() => initialRecord?.password || "")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [error, setError] = useState("")

  // Destructive Delete Confirmation State
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  // Destructive Overwrite Password Confirmation State
  const [isConfirmingGenerate, setIsConfirmingGenerate] = useState(false)

  // Undo Generated Password State
  const [previousPassword, setPreviousPassword] = useState<string | null>(null)

  // Generator Options State
  const [showGenOptions, setShowGenOptions] = useState(false)
  const [genOptions, setGenOptions] = useState({
    length: 18,
    useUppercase: true,
    useLowercase: true,
    useNumbers: true,
    useSymbols: true
  })

  const handleCopy = (field: string, text?: string) => {
    if (!text) return
    copyToClipboard(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleGenerateClick = () => {
    if (record.password && !isConfirmingGenerate) {
      setIsConfirmingGenerate(true)
      return
    }
    executeGeneratePassword()
  }

  const executeGeneratePassword = () => {
    if (record.password) {
      // Always retain original password or previous password so multiple clicks can still restore original
      setPreviousPassword(previousPassword || record.password || originalPassword)
    }
    const newPass = generatePassword(genOptions)
    setRecord((prev) => ({ ...prev, password: newPass }))
    setPasswordVisible(true)
    setIsConfirmingGenerate(false)
    toast.info("Generated new password")
  }

  const handleUndoPassword = () => {
    const targetRestore = previousPassword || originalPassword
    if (targetRestore) {
      setRecord((prev) => ({ ...prev, password: targetRestore }))
      setPreviousPassword(null)
      toast.info("Restored original password")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!record.website.trim()) {
      setError("Name / Title is required.")
      return
    }
    onSave(record)
    onClose()
  }

  const canUndo = (previousPassword !== null && previousPassword !== record.password) || (originalPassword !== "" && originalPassword !== record.password)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto overflow-x-hidden w-[95vw] max-w-[500px] p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-popover text-popover-foreground shadow-2xl">
        <DialogHeader className="pr-6">
          <DialogTitle className="text-base sm:text-lg font-bold tracking-tight">{title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Enter or update account details safely stored on your device.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-1 sm:mt-2">
          {error && (
            <p className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-xl border border-destructive/20 font-medium">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/80">Name / Title *</label>
            <Input
              type="text"
              required
              placeholder="e.g. GitHub, Google, Wi-Fi"
              value={record.website}
              onChange={(e) => setRecord({ ...record, website: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/80">Website URL</label>
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="https://example.com"
                value={record.url}
                onChange={(e) => setRecord({ ...record, url: e.target.value })}
                className="pr-9"
              />
              {record.url && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={record.url.startsWith("http") ? record.url : `https://${record.url}`}
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground p-1 transition cursor-pointer"
                  aria-label="Open URL"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground/80">Username</label>
              <div className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="username"
                  value={record.username}
                  onChange={(e) => setRecord({ ...record, username: e.target.value })}
                  className="pr-9"
                />
                {record.username && (
                  <button
                    type="button"
                    onClick={() => handleCopy('username', record.username)}
                    className="absolute right-2.5 text-muted-foreground hover:text-foreground p-1 transition cursor-pointer"
                    aria-label="Copy Username"
                  >
                    {copiedField === 'username' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground/80">Email Address</label>
              <div className="relative flex items-center">
                <Input
                  type="email"
                  placeholder="user@domain.com"
                  value={record.email}
                  onChange={(e) => setRecord({ ...record, email: e.target.value })}
                  className="pr-9"
                />
                {record.email && (
                  <button
                    type="button"
                    onClick={() => handleCopy('email', record.email)}
                    className="absolute right-2.5 text-muted-foreground hover:text-foreground p-1 transition cursor-pointer"
                    aria-label="Copy Email"
                  >
                    {copiedField === 'email' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Password Field & Generator Header */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground/80">Password</label>
              <div className="flex items-center gap-1">
                {canUndo && (
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={handleUndoPassword}
                    className="h-6 gap-1 px-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Restore original password"
                  >
                    <Undo2 size={12} /> Undo
                  </Button>
                )}

                {isConfirmingGenerate ? (
                  <div className="flex items-center gap-1 animate-in fade-in duration-150">
                    <Button
                      type="button"
                      variant="destructive"
                      size="xs"
                      onClick={executeGeneratePassword}
                      className="h-6 gap-1 px-2 text-[11px] font-semibold cursor-pointer"
                    >
                      Confirm Replace?
                    </Button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmingGenerate(false)}
                      className="text-[11px] text-muted-foreground hover:text-foreground px-1 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="xs"
                    onClick={handleGenerateClick}
                    className="h-6 gap-1 px-2.5 text-[11px] font-semibold cursor-pointer"
                  >
                    <KeyRound size={12} /> Generate
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setShowGenOptions(!showGenOptions)}
                  title="Password Generator Options"
                  className={`size-6 cursor-pointer ${showGenOptions ? "text-primary bg-muted" : "text-muted-foreground"}`}
                >
                  <SlidersHorizontal size={13} />
                </Button>
              </div>
            </div>

            <div className="relative flex items-center">
              <Input
                type={passwordVisible ? "text" : "password"}
                placeholder="••••••••••••"
                className="pr-16 font-mono text-xs sm:text-sm"
                value={record.password}
                onChange={(e) => setRecord({ ...record, password: e.target.value })}
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="text-muted-foreground hover:text-foreground p-1 transition cursor-pointer"
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                  title={passwordVisible ? "Hide password" : "Show password"}
                >
                  {passwordVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {record.password && (
                  <button
                    type="button"
                    onClick={() => handleCopy('password', record.password)}
                    className="text-muted-foreground hover:text-foreground p-1 transition cursor-pointer"
                    aria-label="Copy Password"
                    title="Copy password (clears in 30s)"
                  >
                    {copiedField === 'password' ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                  </button>
                )}
              </div>
            </div>

            {/* Expandable Password Generator Options */}
            {showGenOptions && (
              <div className="p-3 bg-muted/50 border border-border rounded-2xl flex flex-col gap-2.5 mt-1 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-foreground/80 shrink-0">Length: {genOptions.length}</span>
                  <input
                    type="range"
                    min={8}
                    max={64}
                    value={genOptions.length}
                    onChange={(e) => setGenOptions({ ...genOptions, length: Number(e.target.value) })}
                    className="w-28 sm:w-36 accent-primary cursor-pointer"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1.5 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="gen-uppercase"
                      checked={genOptions.useUppercase}
                      onCheckedChange={(checked) => setGenOptions({ ...genOptions, useUppercase: !!checked })}
                    />
                    <label htmlFor="gen-uppercase" className="text-xs cursor-pointer select-none font-medium">
                      Uppercase <span className="font-mono text-[11px] text-muted-foreground">(A-Z)</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="gen-lowercase"
                      checked={genOptions.useLowercase}
                      onCheckedChange={(checked) => setGenOptions({ ...genOptions, useLowercase: !!checked })}
                    />
                    <label htmlFor="gen-lowercase" className="text-xs cursor-pointer select-none font-medium">
                      Lowercase <span className="font-mono text-[11px] text-muted-foreground">(a-z)</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="gen-numbers"
                      checked={genOptions.useNumbers}
                      onCheckedChange={(checked) => setGenOptions({ ...genOptions, useNumbers: !!checked })}
                    />
                    <label htmlFor="gen-numbers" className="text-xs cursor-pointer select-none font-medium">
                      Numbers <span className="font-mono text-[11px] text-muted-foreground">(0-9)</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="gen-symbols"
                      checked={genOptions.useSymbols}
                      onCheckedChange={(checked) => setGenOptions({ ...genOptions, useSymbols: !!checked })}
                    />
                    <label htmlFor="gen-symbols" className="text-xs cursor-pointer select-none font-medium">
                      Symbols <span className="font-mono text-[11px] text-muted-foreground">(!@#$)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/80">Mobile Phone</label>
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="+1 234 567 8900"
                value={record.mobile}
                onChange={(e) => setRecord({ ...record, mobile: e.target.value })}
                className="pr-9"
              />
              {record.mobile && (
                <button
                  type="button"
                  onClick={() => handleCopy('mobile', record.mobile)}
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground p-1 transition cursor-pointer"
                  aria-label="Copy Mobile"
                >
                  {copiedField === 'mobile' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/80">Notes / Recovery Codes</label>
            <textarea
              rows={3}
              placeholder="Security questions, pin codes, notes..."
              className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none text-xs sm:text-sm"
              value={record.notes}
              onChange={(e) => setRecord({ ...record, notes: e.target.value })}
            />
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-2">
            {isConfirmingDelete ? (
              <div className="flex items-center justify-between w-full gap-2 min-w-0">
                <span className="text-sm font-semibold text-destructive truncate">Delete password?</span>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsConfirmingDelete(false)}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (onDelete) onDelete()
                      onClose()
                    }}
                    className="gap-1 px-3 font-semibold cursor-pointer"
                  >
                    <Trash2 size={13} /> Yes, Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full gap-2 min-w-0">
                {onDelete && initialRecord ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={15} /> Delete
                  </Button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2 shrink-0">
                  <Button type="button" variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
                    Cancel
                  </Button>
                  <Button type="submit" variant="default" size="sm" className="cursor-pointer">
                    Save Password
                  </Button>
                </div>
              </div>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { RecordFormModal }
