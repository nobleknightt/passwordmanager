import { useEffect, useRef, useState } from "react"

function readFile(file, setFileContent) {
  const reader = new FileReader()
  reader.addEventListener('load', (event) => {
    setFileContent(JSON.parse(event.target.result))
  })
  reader.readAsText(file)
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
    {
      "website": "google.com",
      "url": "https://accounts.google.com",
      "username": "johndoe",
      "email": "johndoe@gmail.com",
      "password": "john@123",
      "mobile": "9876543210",
      "notes": "this is for google.com"
    },
    {
      "website": "google.com",
      "url": "https://accounts.google.com",
      "username": "johndoe",
      "email": "johndoe@gmail.com",
      "password": "john@123",
      "mobile": "9876543210",
      "notes": "this is for google.com"
    },
    {
      "website": "google.com",
      "url": "https://accounts.google.com",
      "username": "johndoe",
      "email": "johndoe@gmail.com",
      "password": "john@123",
      "mobile": "9876543210",
      "notes": "this is for google.com"
    },
    {
      "website": "google.com",
      "url": "https://accounts.google.com",
      "username": "johndoe",
      "email": "johndoe@gmail.com",
      "password": "john@123",
      "mobile": "9876543210",
      "notes": "this is for google.com"
    }
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
    // setShowUploadPopup(true)
    // setRecordIndex(0)
    // setShowRecordPopup(true)
  }, [])

  return (
    <div className="relative h-screen flex items-center justify-center font-['Atkinson_Hyperlegible'] tracking-tight bg-slate-50">
      <div className="h-full flex flex-col gap-1">
        <div className="flex flex-col gap-1">
          <input className="border"></input>
          <div className="flex gap-1">
            <button className="border w-full" onClick={() => {
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
            <button className="border w-full" onClick={() => setShowDownloadPopup(true)}>Download</button>
          </div>
        </div>
        <div className="grow flex flex-col gap-1 overflow-auto">
          {
            records.map((value, index) => {
              return (
                <div key={index} className="border px-1" onClick={() => {
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
      <div className={`${showUploadPopup ? "absolute w-full border flex flex-col gap-1 bg-slate-50 p-1" : "hidden"}`}>
        <input className="border" type="file" onChange={(event) => setFile(event.target.files[0])}></input>
        <input className="border" type="password" placeholder="password" onChange={(event) => setPassword(event.target.value)}></input>
        <div className="flex gap-1">
          <button className="border w-full bg-slate-200">Upload</button>
          <button className="border w-full" onClick={() => setShowUploadPopup(false)}>Cancel</button>
        </div>
      </div>
      <div className={`${showRecordPopup ? "absolute w-full border flex flex-col gap-1 bg-slate-50 p-1" : "hidden"}`}>
        {
          Object.keys(updatedRecord).map((value) => 
            <input key={value} className="border" placeholder={value} value={updatedRecord[value]} onChange={(event) =>
              setUpdatedRecord({...updatedRecord, [value]: event.target.value})
            }></input>
          )
        }
        <div className="flex gap-1">
          <button className="border" onClick={() => {
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
          <button className="border" onClick={() => {
            setUpdatedRecord({})
            setRecordIndex(-1)
            setShowRecordPopup(false)
          }}>Close</button>
        </div>
      </div>
      <div className={`${showDownloadPopup ? "absolute w-full border flex flex-col gap-1 bg-slate-50 p-1" : "hidden"}`}>
        <input className="border" type="password" placeholder="password" value={password} onChange={(event) => setPassword(event.target.value)}></input>
        <div className="flex gap-1">
          <button className="border w-full bg-slate-200" onClick={
            () => {
                const fileContent = JSON.stringify(records)
                const blob = new Blob([fileContent], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                linkRef.current.href = url
                linkRef.current.download = "passwords"
                linkRef.current.click() 
                setTimeout(() => URL.revokeObjectURL(url), 2000) 
            }
          }>
            <a ref={linkRef}>Download</a>
          </button>
          <button className="border w-full" onClick={() => setShowDownloadPopup(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default App
