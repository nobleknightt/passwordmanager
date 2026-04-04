/* eslint-disable react/prop-types */
import { useState, useRef } from "react"
import { ExternalLink, Copy, Eye, EyeOff } from "lucide-react"


function AddRecord({ records, setRecords }) {
  const [newRecord, setNewRecord] = useState({
    website: "",
    url: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
    notes: ""
  })
  const [passwordVisible, setPasswordVisible] = useState(false)
  const dialogRef = useRef(null)

  const emptyRecord = { website: "", url: "", username: "", email: "", password: "", mobile: "", notes: "" }

  return (
    <>
      <button type="button" className="border rounded w-full bg-slate-200" onClick={() => dialogRef.current.showModal()}>New</button>
      <dialog ref={dialogRef} aria-labelledby="add-record-title" className="m-auto open:max-w-[400px] open:w-[calc(100vw-16px)] open:border open:rounded open:flex open:flex-col open:gap-4 open:bg-slate-50 open:p-8">
        <div>
          <h2 id="add-record-title" className="pl-1 text-lg">Add New Record</h2>
          <hr />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <label htmlFor="new-name" className="pl-1 text-sm">Name</label>
            <input id="new-name" className="border rounded px-2 py-0.5 outline-none" value={newRecord.website} onChange={(event) =>
              setNewRecord({ ...newRecord, website: event.target.value })
            } />
          </div>
          <div className="flex flex-col">
            <label htmlFor="new-url" className="pl-1 text-sm">URL</label>
            <div className="border rounded relative">
              <input id="new-url" className="rounded px-2 py-0.5 outline-none w-full" value={newRecord.url} onChange={(event) =>
                setNewRecord({ ...newRecord, url: event.target.value })
              } />
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <a target="_blank" rel="noreferrer" href={newRecord.url} aria-label="Open URL in new tab" className="rounded-sm bg-white"><ExternalLink size={16} /></a>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="new-username" className="pl-1 text-sm">Username</label>
            <div className="border rounded relative">
              <input id="new-username" className="rounded px-2 py-0.5 outline-none w-full" value={newRecord.username} onChange={(event) =>
                setNewRecord({ ...newRecord, username: event.target.value })
              } />
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <button type="button" aria-label="Copy username" className="rounded-sm bg-white" onClick={() => navigator.clipboard.writeText(newRecord.username)}><Copy size={16} /></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="new-email" className="pl-1 text-sm">Email</label>
            <div className="border rounded relative">
              <input id="new-email" type="email" className="rounded px-2 py-0.5 outline-none w-full" value={newRecord.email} onChange={(event) =>
                setNewRecord({ ...newRecord, email: event.target.value })
              } />
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <button type="button" aria-label="Copy email" className="rounded-sm bg-white" onClick={() => navigator.clipboard.writeText(newRecord.email)}><Copy size={16} /></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="new-password" className="pl-1 text-sm">Password</label>
            <div className="border rounded relative">
              <input id="new-password" type={passwordVisible ? "text" : "password"} className="rounded px-2 py-0.5 outline-none w-full" value={newRecord.password} onChange={(event) =>
                setNewRecord({ ...newRecord, password: event.target.value })
              } />
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1 gap-0.5">
                <button type="button" aria-label={passwordVisible ? "Hide password" : "Show password"} className="rounded-sm bg-white" onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                <button type="button" aria-label="Copy password" className="rounded-sm bg-white" onClick={() => navigator.clipboard.writeText(newRecord.password)}><Copy size={16} /></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="new-mobile" className="pl-1 text-sm">Mobile</label>
            <div className="border rounded relative">
              <input id="new-mobile" className="rounded px-2 py-0.5 outline-none w-full" value={newRecord.mobile} onChange={(event) =>
                setNewRecord({ ...newRecord, mobile: event.target.value })
              } />
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <button type="button" aria-label="Copy mobile" className="rounded-sm bg-white" onClick={() => navigator.clipboard.writeText(newRecord.mobile)}><Copy size={16} /></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="new-notes" className="pl-1 text-sm">Notes</label>
            <textarea id="new-notes" rows={2} className="border rounded px-2 py-0.5 outline-none" value={newRecord.notes} onChange={(event) =>
              setNewRecord({ ...newRecord, notes: event.target.value })
            }></textarea>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" className="border rounded w-full bg-slate-200 py-0.5" onClick={() => {
            setRecords([...records, newRecord])
            setNewRecord(emptyRecord)
            dialogRef.current.close()
          }}>Save</button>
          <button type="button" className="border rounded w-full py-0.5" onClick={() => {
            setNewRecord(emptyRecord)
            dialogRef.current.close()
          }}>Cancel</button>
        </div>
      </dialog>
    </>
  )
}

export { AddRecord }
