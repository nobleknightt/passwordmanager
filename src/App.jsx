import { useState } from "react"
import AddRecord from "./components/AddRecord"
import ImportFromFile from "./components/ImportFromFile"
import ExportToFile from "./components/ExportToFile"
import Records from "./components/Records"

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

export default App
