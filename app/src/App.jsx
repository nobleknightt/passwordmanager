import { useEffect, useRef, useState } from "react"


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

function App() {
  const [records, setRecords] = useState([
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

  const [file, setFile] = useState(null)
  const [password, setPassword] = useState("")
  const [showUploadPopup, setShowUploadPopup] = useState(false)
  const [showDownloadPopup, setShowDownloadPopup] = useState(false)
  const [showRecordPopup, setShowRecordPopup] = useState(false)
  const [recordIndex, setRecordIndex] = useState(-1)
  const [updatedRecord, setUpdatedRecord] = useState({})

  const linkRef = useRef(null)

  useEffect(() => {
    if (records.length == 0) {
      setShowUploadPopup(true)
    }
    // setShowUploadPopup(true)
    // setRecordIndex(0)
    // setShowRecordPopup(true)
  }, [])

  return (
    <div className="relative h-screen flex items-center justify-center font-['Atkinson_Hyperlegible'] tracking-tight bg-slate-50 pt-1">
      <div className="h-full max-w-[400px] w-[calc(100vw-8px)] flex flex-col gap-1">
        <div className="flex flex-col gap-1">
          <input className="border rounded px-1"></input>
          <div className="flex gap-1">
            <button className="border rounded w-full bg-slate-200" onClick={() => {
              setRecordIndex(records.length)
              setUpdatedRecord({
                "website": "",
                "url": "",
                "username": "",
                "email": "",
                "password": "",
                "mobile": "",
                "notes": ""
              })
              setShowRecordPopup(true)
            }}>New</button>
            <button className="border rounded w-full" onClick={() => setShowDownloadPopup(true)}>Download</button>
          </div>
        </div>
        <div className="grow flex flex-col gap-1 overflow-auto">
          {
            records.map((value, index) => {
              return (
                <div key={index} className="border rounded px-1" onClick={() => {
                  setRecordIndex(index)
                  setUpdatedRecord(records[index])
                  setShowRecordPopup(true)
                }}>
                  <div className="">{value.website}</div>
                  <div className="">{value.username}</div>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className={`${showUploadPopup ? "absolute max-w-[400px] w-[calc(100vw-8px)] border rounded flex flex-col gap-1 bg-slate-50 p-1" : "hidden"}`}>
        <input className="border rounded" type="file" onChange={(event) => setFile(event.target.files[0])}></input>
        <input className="border rounded px-1" type="password" placeholder="password" onChange={(event) => setPassword(event.target.value)}></input>
        <div className="flex gap-1">
          <button className="border rounded w-full bg-slate-200" onClick={() => {
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
            setShowUploadPopup(false)
          }}>Upload</button>
          <button className="border rounded w-full" onClick={() => setShowUploadPopup(false)}>Cancel</button>
        </div>
      </div>
      <div className={`${showRecordPopup ? "absolute max-w-[400px] w-[calc(100vw-8px)] border rounded flex flex-col gap-1 bg-slate-50 p-1" : "hidden"}`}>
        {
          Object.keys(updatedRecord).map((value) =>
            <input key={value} className="border rounded px-1" placeholder={value} value={updatedRecord[value]} onChange={(event) =>
              setUpdatedRecord({ ...updatedRecord, [value]: event.target.value })
            }></input>
          )
        }
        <div className="flex gap-1">
          <button className="border rounded w-full bg-slate-200" onClick={() => {
            recordIndex < records.length
              ? setRecords(records.map((value, index) =>
                index == recordIndex
                  ? { ...value, ...updatedRecord }
                  : value
              ))
              : setRecords([...records, updatedRecord])
            setUpdatedRecord({})
            setRecordIndex(-1)
            setShowRecordPopup(false)
          }}>Save</button>
          <button className="border rounded w-full" onClick={() => {
            setUpdatedRecord({})
            setRecordIndex(-1)
            setShowRecordPopup(false)
          }}>Close</button>
        </div>
      </div>
      <div className={`${showDownloadPopup ? "absolute max-w-[400px] w-[calc(100vw-8px)] border rounded flex flex-col gap-1 bg-slate-50 p-1" : "hidden"}`}>
        <input className="border rounded px-1" type="password" placeholder="password" value={password} onChange={(event) => setPassword(event.target.value)} required></input>
        <div className="flex gap-1">
          <button className="border rounded w-full bg-slate-200" onClick={
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
          }>Download</button>
          <a ref={linkRef} className="hidden"></a>
          <button className="border w-full rounded" onClick={() => setShowDownloadPopup(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default App
