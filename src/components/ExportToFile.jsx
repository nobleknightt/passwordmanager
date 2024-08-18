/* eslint-disable react/prop-types */
import { useRef } from "react"
import { encryptWith_AES_GCM } from "../utils"


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

export default ExportToFile
