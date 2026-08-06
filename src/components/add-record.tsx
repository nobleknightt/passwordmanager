import { useState } from "react"
import { Plus } from "lucide-react"
import { RecordFormModal } from "@/components/record-form-modal"
import { Button } from "@/components/ui/button"
import { RecordItem } from "@/types"

interface AddRecordProps {
  records: RecordItem[]
  setRecords: (records: RecordItem[]) => void
  onRecordAdded?: (title: string) => void
}

function AddRecord({ records, setRecords, onRecordAdded }: AddRecordProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = (newRecord: RecordItem) => {
    setRecords([...records, { ...newRecord, id: Date.now() }])
    if (onRecordAdded) onRecordAdded(newRecord.website)
  }

  return (
    <>
      <Button
        type="button"
        variant="default"
        size="default"
        className="w-full sm:w-auto gap-1.5 font-medium shadow-md cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Plus size={16} />
        Add Password
      </Button>

      {isOpen && (
        <RecordFormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSave={handleSave}
          title="Add Password"
        />
      )}
    </>
  )
}

export { AddRecord }
