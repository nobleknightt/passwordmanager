/* eslint-disable react/prop-types */
import { useState, useRef } from "react"
import { Eye, EyeOff } from "lucide-react"
import { decryptWith_AES_GCM, base64ToUint8Array } from "../utils"


function ImportFromFile({ setRecords, password, setPassword }) {
  const [file, setFile] = useState(null)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [error, setError] = useState("")
  const dialogRef = useRef(null)

  return (
    <>
      <button type="button" className="border rounded w-full py-0.5" onClick={() => dialogRef.current.showModal()}>Import</button>
      <dialog ref={dialogRef} aria-labelledby="import-title" className="m-auto open:max-w-[400px] open:w-[calc(100vw-16px)] open:border open:rounded open:flex open:flex-col open:gap-4 open:bg-slate-50 open:p-8">
        <div>
          <h2 id="import-title" className="pl-1 text-lg">Import from a File</h2>
          <hr />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <label htmlFor="import-file" className="text-sm pl-1">Encrypted Passwords File</label>
            <input id="import-file" className="border rounded w-full text-sm file:border-0 file:bg-slate-200 file:px-2 file:py-0.5 file:mr-2 file:cursor-pointer" type="file" onChange={(event) => setFile(event.target.files[0])} />
          </div>
          <div>
            <label htmlFor="import-password" className="text-sm pl-1">Password for File Decryption</label>
            <div className="border rounded relative">
              <input id="import-password" className="rounded px-2 py-0.5 outline-none w-full" type={passwordVisible ? "text" : "password"} placeholder="password" onChange={(event) => setPassword(event.target.value)} />
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
                <button type="button" aria-label={passwordVisible ? "Hide password" : "Show password"} className="rounded-sm bg-white" onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
          </div>
        </div>
        {error && <p role="alert" className="text-sm text-red-500 pl-1">{error}</p>}
        <div className="flex gap-2">
          <button type="button" className="border rounded w-full bg-slate-200 py-0.5" onClick={() => {
            const reader = new FileReader()
            reader.addEventListener('load', (event) => {
              const fileContent = event.target.result
              const ciphertextBytes = base64ToUint8Array(fileContent)
              const encoder = new TextEncoder()
              const passwordBytes = encoder.encode(password)

              decryptWith_AES_GCM(ciphertextBytes, passwordBytes)
                .then(function (plaintextBytes) {
                  const decoder = new TextDecoder()
                  const plaintext = decoder.decode(plaintextBytes)
                  setRecords(JSON.parse(plaintext))
                  dialogRef.current.close()
                })
                .catch(() => setError("Wrong password or invalid file."))
            })
            reader.readAsText(file)
          }}>Upload</button>
          <button type="button" className="border rounded w-full py-0.5" onClick={() => dialogRef.current.close()}>Cancel</button>
        </div>
      </dialog>
    </>
  )
}

export { ImportFromFile }
