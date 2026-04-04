/* eslint-disable react/prop-types */
import { useState, useRef } from "react"
import { ExternalLink, Copy, Eye, EyeOff } from "lucide-react"


function Records({ records, setRecords }) {
  const [recordIndex, setRecordIndex] = useState(-1)
  const [updatedRecord, setUpdatedRecord] = useState({})
  const [passwordVisible, setPasswordVisible] = useState(false)
  const updateDialogRef = useRef(null)

  return (
    <>
      <div className="grow flex flex-col gap-2 overflow-auto">
        {
          records.map((value, index) => {
            return (
              <div key={index} className="border rounded pl-4 pr-2 py-2 flex items-center justify-between gap-2 w-full">
                <div className="flex flex-col items-start w-full min-w-0">
                  <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis">{value.website}</div>
                  <div className="text-sm">{value.username}</div>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="text-sm border px-2 py-0.5 rounded hover:bg-slate-200" onClick={() => {
                    setRecordIndex(index)
                    setUpdatedRecord(records[index])
                    updateDialogRef.current.showModal()
                  }}>View / Update</button>
                </div>
              </div>
            )
          })
        }
      </div>
      <dialog ref={updateDialogRef} aria-labelledby="update-record-title" className="m-auto open:max-w-[400px] open:w-[calc(100vw-16px)] open:border open:rounded open:flex open:flex-col open:gap-4 open:bg-slate-50 open:p-8">
        <div>
          <h2 id="update-record-title" className="pl-1 text-lg">View / Update Record</h2>
          <hr />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <label htmlFor="update-name" className="pl-1 text-sm">Name</label>
            <input id="update-name" className="border rounded px-2 py-0.5 outline-none" value={updatedRecord.website ?? ""} onChange={(event) =>
              setUpdatedRecord({ ...updatedRecord, website: event.target.value })
            } />
          </div>
          <div className="flex flex-col">
            <label htmlFor="update-url" className="pl-1 text-sm">URL</label>
            <div className="border rounded relative">
              <input id="update-url" className="rounded px-2 py-0.5 outline-none w-full" value={updatedRecord.url ?? ""} onChange={(event) =>
                setUpdatedRecord({ ...updatedRecord, url: event.target.value })
              } />
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <a target="_blank" rel="noreferrer" href={updatedRecord.url} aria-label="Open URL in new tab" className="rounded-sm bg-white"><ExternalLink size={16} /></a>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="update-username" className="pl-1 text-sm">Username</label>
            <div className="border rounded relative">
              <input id="update-username" className="rounded px-2 py-0.5 outline-none w-full" value={updatedRecord.username ?? ""} onChange={(event) =>
                setUpdatedRecord({ ...updatedRecord, username: event.target.value })
              } />
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <button type="button" aria-label="Copy username" className="rounded-sm bg-white" onClick={() => navigator.clipboard.writeText(updatedRecord.username)}><Copy size={16} /></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="update-email" className="pl-1 text-sm">Email</label>
            <div className="border rounded relative">
              <input id="update-email" type="email" className="rounded px-2 py-0.5 outline-none w-full" value={updatedRecord.email ?? ""} onChange={(event) =>
                setUpdatedRecord({ ...updatedRecord, email: event.target.value })
              } />
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <button type="button" aria-label="Copy email" className="rounded-sm bg-white" onClick={() => navigator.clipboard.writeText(updatedRecord.email)}><Copy size={16} /></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="update-password" className="pl-1 text-sm">Password</label>
            <div className="border rounded relative">
              <input id="update-password" type={passwordVisible ? "text" : "password"} className="rounded px-2 py-0.5 outline-none w-full" value={updatedRecord.password ?? ""} onChange={(event) =>
                setUpdatedRecord({ ...updatedRecord, password: event.target.value })
              } />
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1 gap-0.5">
                <button type="button" aria-label={passwordVisible ? "Hide password" : "Show password"} className="rounded-sm bg-white" onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                <button type="button" aria-label="Copy password" className="rounded-sm bg-white" onClick={() => navigator.clipboard.writeText(updatedRecord.password)}><Copy size={16} /></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="update-mobile" className="pl-1 text-sm">Mobile</label>
            <div className="border rounded relative">
              <input id="update-mobile" className="rounded px-2 py-0.5 outline-none w-full" value={updatedRecord.mobile ?? ""} onChange={(event) =>
                setUpdatedRecord({ ...updatedRecord, mobile: event.target.value })
              } />
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <button type="button" aria-label="Copy mobile" className="rounded-sm bg-white" onClick={() => navigator.clipboard.writeText(updatedRecord.mobile)}><Copy size={16} /></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="update-notes" className="pl-1 text-sm">Notes</label>
            <textarea id="update-notes" rows={2} className="border rounded px-2 py-0.5 outline-none" value={updatedRecord.notes ?? ""} onChange={(event) =>
              setUpdatedRecord({ ...updatedRecord, notes: event.target.value })
            }></textarea>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" className="border rounded w-full bg-slate-200 py-0.5" onClick={() => {
            recordIndex < records.length
              ? setRecords(records.map((value, index) =>
                index == recordIndex
                  ? { ...value, ...updatedRecord }
                  : value
              ))
              : setRecords([...records, updatedRecord])
            setUpdatedRecord({})
            setRecordIndex(-1)
            updateDialogRef.current.close()
          }}>Save</button>
          <button type="button" className="border rounded w-full py-0.5" onClick={() => {
            setUpdatedRecord({})
            setRecordIndex(-1)
            updateDialogRef.current.close()
          }}>Close</button>
        </div>
      </dialog>
    </>
  )
}

export { Records }
