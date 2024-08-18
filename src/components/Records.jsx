/* eslint-disable react/prop-types */
import { useState, useRef } from "react"
import OpenInNew from "../images/open_in_new.svg"
import ContentCopy from "../images/content_copy.svg"
import Visibility from "../images/visibility.svg"
import VisibilityOff from "../images/visibility_off.svg"


function Records({ records, setRecords }) {
  const [recordIndex, setRecordIndex] = useState(-1)
  const [updatedRecord, setUpdatedRecord] = useState({})
  const [passwordVisible, setPasswordVisible] = useState(false)
  const updateDialogRef = useRef(null)
  // const deleteDialogRef = useRef(null)

  return (
    <>
      <div className="grow flex flex-col gap-2 overflow-auto">
        {console.log(records)}
        {
          records.map((value, index) => {
            return (
              <div key={index} className="border rounded pl-4 pr-2 py-2 flex items-center justify-between gap-2 w-full">
                <div className="flex flex-col items-start w-full min-w-0">
                  <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis">{value.website}</div>
                  <div className="text-sm">{value.username}</div>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm border px-2 py-0.5 rounded hover:bg-slate-200" onClick={() => {
                    setRecordIndex(index)
                    setUpdatedRecord(records[index])
                    updateDialogRef.current.showModal()
                  }}>View / Update</button>
                  {/* <button className="text-sm border px-2 py-0.5 rounded hover:bg-slate-200">Delete</button> */}
                </div>
              </div>
            )
          })
        }
      </div>
      <dialog ref={updateDialogRef} className="open:max-w-[400px] open:w-[calc(100vw-16px)] open:border open:rounded open:flex open:flex-col open:gap-4 open:bg-slate-50 open:p-8">
        <div>
          <span className="pl-1 text-lg">View / Update Record</span>
          <hr />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <label className="pl-1 text-sm">Name</label>
            <input className="border rounded px-2 py-0.5 outline-none" placeholder={updatedRecord.website} value={updatedRecord.website} onChange={(event) =>
              setUpdatedRecord({ ...updatedRecord, website: event.target.value })
            }></input>
          </div>
          <div className="flex flex-col">
            <label className="pl-1 text-sm">URL</label>
            <div className="border rounded relative">
              <input className="rounded px-2 py-0.5 outline-none w-full" placeholder={updatedRecord.url} value={updatedRecord.url} onChange={(event) =>
                setUpdatedRecord({ ...updatedRecord, url: event.target.value })
              }></input>
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <a target="_blank" rel="noreferrer" href={updatedRecord.url} className="rounded-sm bg-white"><img src={OpenInNew} width="16px"></img></a>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="pl-1 text-sm">Username</label>
            <div className="border rounded relative">
              <input className="rounded px-2 py-0.5 outline-none w-full" placeholder={updatedRecord.username} value={updatedRecord.username} onChange={(event) =>
                setUpdatedRecord({ ...updatedRecord, username: event.target.value })
              }></input>
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <button className="rounded-sm bg-white" onClick={() => navigator.clipboard.writeText(updatedRecord.username)}><img src={ContentCopy} width="16px"></img></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="pl-1 text-sm">Email</label>
            <div className="border rounded relative">
              <input type="email" className="rounded px-2 py-0.5 outline-none w-full" placeholder={updatedRecord.email} value={updatedRecord.email} onChange={(event) =>
                setUpdatedRecord({ ...updatedRecord, email: event.target.value })
              }></input>
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <button className="rounded-sm bg-white" onClick={() => navigator.clipboard.writeText(updatedRecord.email)}><img src={ContentCopy} width="16px"></img></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="pl-1 text-sm">Password</label>
            <div className="border rounded relative">
              <input type={passwordVisible ? "text" : "password"} className="rounded px-2 py-0.5 outline-none w-full" placeholder={updatedRecord.password} value={updatedRecord.password} onChange={(event) =>
                setUpdatedRecord({ ...updatedRecord, password: event.target.value })
              }></input>
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1 gap-0.5">
                <button className="rounded-sm bg-white" onClick={() => setPasswordVisible(!passwordVisible)}><img src={passwordVisible ? VisibilityOff : Visibility} width="16px"></img></button>
                <button className="rounded-sm bg-white" onClick={() => navigator.clipboard.writeText(updatedRecord.password)}><img src={ContentCopy} width="16px"></img></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="pl-1 text-sm">Mobile</label>
            <div className="border rounded relative">
              <input className="rounded px-2 py-0.5 outline-none w-full" placeholder={updatedRecord.mobile} value={updatedRecord.mobile} onChange={(event) =>
                setUpdatedRecord({ ...updatedRecord, mobile: event.target.value })
              }></input>
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <button className="rounded-sm bg-white" onClick={() => navigator.clipboard.writeText(updatedRecord.mobile)}><img src={ContentCopy} width="16px"></img></button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="pl-1 text-sm">Notes</label>
            <textarea rows={2} className="border rounded px-2 py-0.5 outline-none" placeholder={updatedRecord.notes} value={updatedRecord.notes} onChange={(event) =>
              setUpdatedRecord({ ...updatedRecord, notes: event.target.value })
            }></textarea>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="border rounded w-full bg-slate-200 py-0.5" onClick={() => {
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
          <button className="border rounded w-full py-0.5" onClick={() => {
            setUpdatedRecord({})
            setRecordIndex(-1)
            updateDialogRef.current.close()
          }}>Close</button>
        </div>
      </dialog>
    </>
  )
}

export default Records
