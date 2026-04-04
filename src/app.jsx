import { useState } from "react"
import { AddRecord } from "./components/add-record"
import { ImportFromFile } from "./components/import-from-file"
import { ExportToFile } from "./components/export-to-file"
import { Records } from "./components/records"

function App() {
  const [records, setRecords] = useState([])
  const [password, setPassword] = useState("")

  return (
    <div className="relative h-screen flex items-center justify-center font-['Bricolage_Grotesque'] tracking-tight bg-slate-50 p-4">
      <div className="h-full max-w-[400px] w-[calc(100vw-16px)] flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="flex gap-2">
            <AddRecord records={records} setRecords={setRecords} />
            {
              records.length === 0
                ? <ImportFromFile setRecords={setRecords} password={password} setPassword={setPassword} />
                : <ExportToFile records={records} password={password} setPassword={setPassword} />
            }
          </div>
        </div>
        <Records records={records} setRecords={setRecords} />
      </div>
    </div>
  )
}

export { App }
