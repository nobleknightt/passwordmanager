/* eslint-disable react/prop-types */
import { useState, useRef } from "react"
import { Eye, EyeOff } from "lucide-react"
import { encryptWith_AES_GCM } from "../utils"


function ExportToFile({ records, password, setPassword }) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [error, setError] = useState("")
  const dialogRef = useRef(null)
  const linkRef = useRef(null)

  return (
    <>
      <button type="button" className="border rounded w-full py-0.5" onClick={() => dialogRef.current.showModal()}>Export</button>
      <dialog ref={dialogRef} aria-labelledby="export-title" className="m-auto open:max-w-[400px] open:w-[calc(100vw-16px)] open:border open:rounded open:flex open:flex-col open:gap-4 open:bg-slate-50 open:p-8">
        <div>
          <h2 id="export-title" className="pl-1 text-lg">Export to a File</h2>
          <hr />
        </div>
        <div className="flex flex-col">
          <label htmlFor="export-password" className="text-sm pl-1">Password for File Encryption</label>
          <div className="border rounded relative">
            <input id="export-password" className="rounded px-2 py-0.5 outline-none w-full" type={passwordVisible ? "text" : "password"} placeholder="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center p-1">
              <button type="button" aria-label={passwordVisible ? "Hide password" : "Show password"} className="rounded-sm bg-white" onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </div>
        </div>
        {error && <p role="alert" className="text-sm text-red-500 pl-1">{error}</p>}
        <div className="flex gap-2">
          <button type="button" className="border rounded w-full bg-slate-200 py-0.5" onClick={() => {
            const fileContent = JSON.stringify(records)
            const encoder = new TextEncoder()
            const plaintextBytes = encoder.encode(fileContent)
            const passwordBytes = encoder.encode(password)

            encryptWith_AES_GCM(plaintextBytes, passwordBytes)
              .then(function (IVSaltCiphertextBytes) {
                const base64IVSaltCiphertextBytes = btoa(String.fromCharCode(...IVSaltCiphertextBytes))
                const blob = new Blob([base64IVSaltCiphertextBytes], { type: 'application/octet-stream' })
                const url = URL.createObjectURL(blob)
                linkRef.current.href = url
                linkRef.current.download = "passwords"
                linkRef.current.click()
                setTimeout(() => URL.revokeObjectURL(url), 2000)
              })
              .catch(() => setError("Failed to encrypt. Please try again."))
          }}>Save</button>
          <a ref={linkRef} className="hidden" aria-hidden="true"></a>
          <button type="button" className="border w-full rounded py-0.5" onClick={() => dialogRef.current.close()}>Cancel</button>
        </div>
      </dialog>
    </>
  )
}

export { ExportToFile }
