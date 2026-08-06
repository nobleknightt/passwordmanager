import React, { useState } from "react"
import { Search, ExternalLink, Copy, Check, ShieldAlert, KeyRound } from "lucide-react"
import { RecordFormModal } from "@/components/record-form-modal"
import { copyToClipboard } from "@/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RecordItem } from "@/types"
import { toast } from "sonner"

interface RecordsProps {
  records: RecordItem[]
  setRecords: (records: RecordItem[]) => void
}

function Records({ records, setRecords }: RecordsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredRecords = records.filter((rec) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      (rec.website && rec.website.toLowerCase().includes(q)) ||
      (rec.username && rec.username.toLowerCase().includes(q)) ||
      (rec.email && rec.email.toLowerCase().includes(q)) ||
      (rec.url && rec.url.toLowerCase().includes(q)) ||
      (rec.notes && rec.notes.toLowerCase().includes(q))
    )
  })

  const handleCopyPassword = (e: React.MouseEvent, index: number, password?: string) => {
    e.stopPropagation()
    if (!password) {
      toast.info("No password stored for this item.")
      return
    }
    copyToClipboard(password)
    setCopiedId(`pass-${index}`)
    toast.success("Copied password to clipboard")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSaveUpdated = (updatedRecord: RecordItem) => {
    if (editingIndex === null) return
    const newRecords = [...records]
    newRecords[editingIndex] = updatedRecord
    setRecords(newRecords)
    setEditingIndex(null)
  }

  const handleDelete = (indexToDelete: number) => {
    const title = records[indexToDelete]?.website || "Password"
    setRecords(records.filter((_, idx) => idx !== indexToDelete))
    setEditingIndex(null)
    toast.success(`Deleted "${title}"`)
  }

  return (
    <div className="flex flex-col gap-3 grow min-h-0">
      {/* Search Input */}
      {records.length > 0 && (
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center grow">
            <Search size={15} className="absolute left-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search passwords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs sm:text-sm"
            />
          </div>
          <Badge variant="outline" className="px-2.5 py-1 text-xs shrink-0 font-medium">
            {filteredRecords.length} / {records.length}
          </Badge>
        </div>
      )}

      {/* Record List Container with shadcn ScrollArea */}
      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center grow py-12 text-center text-muted-foreground">
          <div className="p-4 rounded-full bg-muted/60 mb-3">
            <KeyRound size={32} className="text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">No passwords saved</p>
          <p className="text-xs max-w-xs mt-1">
            Add a password above or import a backup file.
          </p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
          <ShieldAlert size={28} className="mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">No passwords found matching &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        <ScrollArea className="grow min-h-0 pr-1 sm:pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 auto-rows-max items-start py-0.5">
            {filteredRecords.map((value) => {
              const originalIndex = records.indexOf(value)
              const displaySub = value.username || value.email || value.url || "No identity details"

              return (
                <div
                  key={originalIndex}
                  onClick={() => setEditingIndex(originalIndex)}
                  className="group border border-border hover:border-primary/50 rounded-2xl p-3.5 flex items-center justify-between gap-3 bg-card text-card-foreground hover:shadow-md transition cursor-pointer h-fit"
                >
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <div className="w-full font-semibold text-sm truncate text-foreground">
                      {value.website || "Untitled"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate w-full mt-0.5 font-medium">
                      {displaySub}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {value.url && (
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={value.url.startsWith("http") ? value.url : `https://${value.url}`}
                        aria-label="Open URL in new tab"
                        title="Open URL"
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-xl transition"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => handleCopyPassword(e, originalIndex, value.password)}
                      aria-label="Quick Copy Password"
                      title={value.password ? "Copy Password" : "No password set"}
                      className="text-muted-foreground hover:text-primary cursor-pointer"
                    >
                      {copiedId === `pass-${originalIndex}` ? (
                        <Check size={15} className="text-green-500" />
                      ) : (
                        <Copy size={15} />
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      )}

      {/* Edit Record Modal */}
      {editingIndex !== null && (
        <RecordFormModal
          key={editingIndex}
          initialRecord={records[editingIndex]}
          isOpen={editingIndex !== null}
          onClose={() => setEditingIndex(null)}
          onSave={handleSaveUpdated}
          onDelete={() => handleDelete(editingIndex)}
          title="Edit Password"
        />
      )}
    </div>
  )
}

export { Records }
