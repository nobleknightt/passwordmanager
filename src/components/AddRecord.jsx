/* eslint-disable react/prop-types */
import { useState, useRef } from "react"
import OpenInNew from "../images/open_in_new.svg"
import ContentCopy from "../images/content_copy.svg"
import Visibility from "../images/visibility.svg"
import VisibilityOff from "../images/visibility_off.svg"


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

  return (
    <>
      <button className="border rounded w-full bg-slate-200" onClick={() => {
        dialogRef.current.showModal()
      }}>New</button>
      <dialog ref={dialogRef} className="open:max-w-[400px] open:w-[calc(100vw-16px)] open:border open:rounded open:flex open:flex-col open:gap-4 open:bg-slate-50 open:p-8">
        <div>
          <span className="pl-1 text-lg">Add New Record</span>
          <hr />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <label className="pl-1 text-sm">Name</label>
            <input className="border rounded px-2 py-0.5 outline-none" placeholder={newRecord.website} value={newRecord.website} onChange={(event) =>
              setNewRecord({ ...newRecord, website: event.target.value })
            }></input>
          </div>
          <div className="flex flex-col">
            <label className="pl-1 text-sm">URL</label>
            <div className="border rounded relative">
              <input className="rounded px-2 py-0.5 outline-none w-full" placeholder={newRecord.url} value={newRecord.url} onChange={(event) =>
                setNewRecord({ ...newRecord, url: event.target.value })
              }></input>
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <a target="_blank" rel="noreferrer" href={newRecord.url} className="rounded-sm bg-white"><img src={OpenInNew} width="16px"></img></a>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="pl-1 text-sm">Username</label>
            <div className="border rounded relative">
              <input className="rounded px-2 py-0.5 outline-none w-full" placeholder={newRecord.username} value={newRecord.username} onChange={(event) =>
                setNewRecord({ ...newRecord, username: event.target.value })
              }></input>
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <button className="rounded-sm bg-white" onClick={() => navigator.clipboard.writeText(newRecord.username)}><img src={ContentCopy} width="16px"></img></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="pl-1 text-sm">Email</label>
            <div className="border rounded relative">
              <input type="email" className="rounded px-2 py-0.5 outline-none w-full" placeholder={newRecord.email} value={newRecord.email} onChange={(event) =>
                setNewRecord({ ...newRecord, email: event.target.value })
              }></input>
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <button className="rounded-sm bg-white"><img src={ContentCopy} width="16px"></img></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="pl-1 text-sm">Password</label>
            <div className="border rounded relative">
              <input type={passwordVisible ? "text" : "password"} className="rounded px-2 py-0.5 outline-none w-full" placeholder={newRecord.password} value={newRecord.password} onChange={(event) =>
                setNewRecord({ ...newRecord, password: event.target.value })
              }></input>
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1 gap-0.5">
                <button className="rounded-sm bg-white" onClick={() => setPasswordVisible(!passwordVisible)}><img src={passwordVisible ? VisibilityOff : Visibility} width="16px"></img></button>
                <button className="rounded-sm bg-white" onClick={() => navigator.clipboard.writeText(newRecord.password)}><img src={ContentCopy} width="16px"></img></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="pl-1 text-sm">Mobile</label>
            <div className="border rounded relative">
              <input className="rounded px-2 py-0.5 outline-none w-full" placeholder={newRecord.mobile} value={newRecord.mobile} onChange={(event) =>
                setNewRecord({ ...newRecord, mobile: event.target.value })
              }></input>
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <button className="rounded-sm bg-white" onClick={() => navigator.clipboard.writeText(newRecord.mobile)}><img src={ContentCopy} width="16px"></img></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="pl-1 text-sm">Notes</label>
            <textarea rows={2} className="border rounded px-2 py-0.5 outline-none" placeholder={newRecord.notes} value={newRecord.notes} onChange={(event) =>
              setNewRecord({ ...newRecord, notes: event.target.value })
            }></textarea>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="border rounded w-full bg-slate-200 py-0.5" onClick={() => {
            setRecords([...records, newRecord])
            setNewRecord({
              website: "",
              url: "",
              username: "",
              email: "",
              password: "",
              mobile: "",
              notes: ""
            })
            dialogRef.current.close()
          }}>Save</button>
          <button className="border rounded w-full py-0.5" onClick={() => {
            setNewRecord({
              website: "",
              url: "",
              username: "",
              email: "",
              password: "",
              mobile: "",
              notes: ""
            })
            dialogRef.current.close()
          }}>Cancel</button>
        </div>
      </dialog>
    </>
  )
}

export default AddRecord
