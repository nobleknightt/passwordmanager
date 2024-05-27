import { useRef, useState } from "react"
import ContentCopy from "./images/content_copy.svg"
import OpenInNew from "./images/open_in_new.svg"
import Visibility from "./images/visibility.svg"
import VisibilityOff from "./images/visibility_off.svg"


async function encryptWith_AES_GCM(plaintextBytes, passwordBytes) {
  const passwordKey = await crypto.subtle.importKey('raw', passwordBytes, { name: 'PBKDF2' }, false, ['deriveKey']);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const aesKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 480000, hash: 'SHA-256' },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertextBytes = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, plaintextBytes);

  console.log("IVSaltCiphertextBytes", iv, salt, new Uint8Array(ciphertextBytes));

  const IVSaltCiphertextBytes = new Uint8Array(iv.length + salt.length + ciphertextBytes.byteLength);
  IVSaltCiphertextBytes.set(iv, 0);
  IVSaltCiphertextBytes.set(salt, iv.length);
  IVSaltCiphertextBytes.set(new Uint8Array(ciphertextBytes), iv.length + salt.length);

  return IVSaltCiphertextBytes;
}

async function decryptWith_AES_GCM(IVSaltCiphertextBytes, passwordBytes) {
  const iv = IVSaltCiphertextBytes.slice(0, 12);
  const salt = IVSaltCiphertextBytes.slice(12, 28);
  const ciphertextBytes = IVSaltCiphertextBytes.slice(28);

  console.log("IVSaltCiphertextBytes", iv, salt, ciphertextBytes);

  const passwordKey = await crypto.subtle.importKey('raw', passwordBytes, { name: 'PBKDF2' }, false, ['deriveKey']);
  const aesKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 480000, hash: 'SHA-256' },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const plaintextBytes = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, ciphertextBytes);

  return new Uint8Array(plaintextBytes);
}

function base64ToUint8Array(base64String) {
  const binaryString = atob(base64String);
  const uint8Array = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return uint8Array;
}

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
                <a target="_blank" href={newRecord.url} className="rounded-sm bg-white"><img src={OpenInNew} width="16px"></img></a>
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

function Records({ records, setRecords }) {
  const [recordIndex, setRecordIndex] = useState(-1)
  const [updatedRecord, setUpdatedRecord] = useState({})
  const [passwordVisible, setPasswordVisible] = useState(false)
  const updateDialogRef = useRef(null)
  const deleteDialogRef = useRef(null)

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
                <a target="_blank" href={updatedRecord.url} className="rounded-sm bg-white"><img src={OpenInNew} width="16px"></img></a>
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
                <button className="rounded-sm bg-white"><img src={ContentCopy} width="16px"></img></button>
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

function ImportFromFile({ setRecords, password, setPassword }) {
  const [file, setFile] = useState(null)
  const dialogRef = useRef(null)

  return (
    <>
      <button className="border rounded w-full py-0.5" onClick={() => dialogRef.current.showModal()}>Import</button>
      <dialog ref={dialogRef} className="open:max-w-[400px] open:w-[calc(100vw-16px)] open:border open:rounded open:flex open:flex-col open:gap-4 open:bg-slate-50 open:p-8">
        <div>
          <span className="pl-1 text-lg">Import from a File</span>
          <hr />
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-full">
            <span className="text-sm pl-1">Encrypted Passwords File</span>
            <input className="border rounded w-full text-sm" type="file" onChange={(event) => setFile(event.target.files[0])}></input>
          </div>
          <div>
            <span className="text-sm pl-1">Password for File Decryption</span>
            <input className="border rounded px-2 py-0.5 outline-none w-full" type="password" placeholder="password" onChange={(event) => setPassword(event.target.value)}></input>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="border rounded w-full bg-slate-200 py-0.5" onClick={() => {
            const reader = new FileReader()
            reader.addEventListener('load', (event) => {
              const fileContent = event.target.result
              const ciphertextBytes = base64ToUint8Array(fileContent);

              const encoder = new TextEncoder();
              const passwordBytes = encoder.encode(password);

              decryptWith_AES_GCM(ciphertextBytes, passwordBytes)
                .then(function (plaintextBytes) {
                  const decoder = new TextDecoder();
                  const plaintext = decoder.decode(plaintextBytes);
                  setRecords(JSON.parse(plaintext))
                })
                .catch((error) => console.log(error))
            })
            reader.readAsText(file)
            dialogRef.current.close()
          }}>Upload</button>
          <button className="border rounded w-full py-0.5" onClick={() => dialogRef.current.close()}>Cancel</button>
        </div>
      </dialog>

    </>
  )
}

function ExportToFile({ records, password, setPassword }) {
  const dialogRef = useRef(null)
  const linkRef = useRef(null)

  return (
    <>
      <button className="border rounded w-full py-0.5" onClick={() => dialogRef.current.showModal()}>Export</button>
      <dialog ref={dialogRef} className="open:max-w-[400px] open:w-[calc(100vw-16px)] open:border open:rounded open:flex open:flex-col open:gap-4 open:bg-slate-50 open:p-8">
        <div>
          <span className="pl-1 text-lg">Export to a File</span>
          <hr />
        </div>
        <div className="flex flex-col">
          <label className="text-sm pl-1">Password for File Encrytion</label>
          <input className="border rounded px-2 py-0.5 outline-none" type="password" placeholder="password" value={password} onChange={(event) => setPassword(event.target.value)} required></input>
        </div>
        <div className="flex gap-2">
          <button className="border rounded w-full bg-slate-200 py-0.5" onClick={
            () => {
              const fileContent = JSON.stringify(records)

              const encoder = new TextEncoder();
              const plaintextBytes = encoder.encode(fileContent);
              const passwordBytes = encoder.encode(password);

              encryptWith_AES_GCM(plaintextBytes, passwordBytes)
                .then(function (IVSaltCiphertextBytes) {
                  const base64IVSaltCiphertextBytes = btoa(String.fromCharCode(...IVSaltCiphertextBytes));
                  const blob = new Blob([base64IVSaltCiphertextBytes], { type: 'application/octet-stream' })
                  const url = URL.createObjectURL(blob)
                  linkRef.current.href = url
                  linkRef.current.download = "passwords"
                  linkRef.current.click()
                  setTimeout(() => URL.revokeObjectURL(url), 2000)
                })
                .catch((error) => console.log(error))
            }
          }>Save</button>
          <a ref={linkRef} className="hidden"></a>
          <button className="border w-full rounded py-0.5" onClick={() => dialogRef.current.close()}>Cancel</button>
        </div>
      </dialog>
    </>
  )
}

function App() {
  const [records, setRecords] = useState([
    {
      "website": "google.com",
      "url": "https://accounts.google.com",
      "username": "johndoe",
      "email": "johndoe@gmail.com",
      "password": "john@123",
      "mobile": "9876543210",
      "notes": "this is for google.com"
    },
    // {
    //   "website": "reallyreallylongname.com",
    //   "url": "https://reallyreallylongname.google.com",
    //   "username": "johndoe",
    //   "email": "johndoe@gmail.com",
    //   "password": "john@123",
    //   "mobile": "9876543210",
    //   "notes": "this is for google.com"
    // },
    // {
    //   "website": "google.com",
    //   "url": "https://accounts.google.com",
    //   "username": "johndoe",
    //   "email": "johndoe@gmail.com",
    //   "password": "john@123",
    //   "mobile": "9876543210",
    //   "notes": "this is for google.com"
    // },
    // {
    //   "website": "google.com",
    //   "url": "https://accounts.google.com",
    //   "username": "johndoe",
    //   "email": "johndoe@gmail.com",
    //   "password": "john@123",
    //   "mobile": "9876543210",
    //   "notes": "this is for google.com"
    // },
    // {
    //   "website": "google.com",
    //   "url": "https://accounts.google.com",
    //   "username": "johndoe",
    //   "email": "johndoe@gmail.com",
    //   "password": "john@123",
    //   "mobile": "9876543210",
    //   "notes": "this is for google.com"
    // }
  ])
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
