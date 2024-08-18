/* eslint-disable react/prop-types */
import { useState, useRef } from "react"
import { decryptWith_AES_GCM, base64ToUint8Array } from "../utils"


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

export default ImportFromFile
