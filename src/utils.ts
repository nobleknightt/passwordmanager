async function encryptWith_AES_GCM(plaintextBytes: Uint8Array, passwordBytes: Uint8Array): Promise<Uint8Array> {
	const passwordKey = await crypto.subtle.importKey(
		'raw',
		passwordBytes.buffer as ArrayBuffer,
		{ name: 'PBKDF2' },
		false,
		['deriveKey']
	)
	const salt = crypto.getRandomValues(new Uint8Array(16))
	const aesKey = await crypto.subtle.deriveKey(
		{ name: 'PBKDF2', salt, iterations: 480000, hash: 'SHA-256' },
		passwordKey,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt']
	)

	const iv = crypto.getRandomValues(new Uint8Array(12))
	const ciphertextBytes = await crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv },
		aesKey,
		plaintextBytes.buffer as ArrayBuffer
	)

	const IVSaltCiphertextBytes = new Uint8Array(iv.length + salt.length + ciphertextBytes.byteLength)
	IVSaltCiphertextBytes.set(iv, 0)
	IVSaltCiphertextBytes.set(salt, iv.length)
	IVSaltCiphertextBytes.set(new Uint8Array(ciphertextBytes), iv.length + salt.length)

	return IVSaltCiphertextBytes
}

async function decryptWith_AES_GCM(IVSaltCiphertextBytes: Uint8Array, passwordBytes: Uint8Array): Promise<Uint8Array> {
	if (!IVSaltCiphertextBytes || IVSaltCiphertextBytes.length < 28) {
		throw new Error('Invalid encrypted data buffer.')
	}

	const iv = IVSaltCiphertextBytes.slice(0, 12)
	const salt = IVSaltCiphertextBytes.slice(12, 28)
	const ciphertextBytes = IVSaltCiphertextBytes.slice(28)

	const passwordKey = await crypto.subtle.importKey(
		'raw',
		passwordBytes.buffer as ArrayBuffer,
		{ name: 'PBKDF2' },
		false,
		['deriveKey']
	)
	const aesKey = await crypto.subtle.deriveKey(
		{ name: 'PBKDF2', salt, iterations: 480000, hash: 'SHA-256' },
		passwordKey,
		{ name: 'AES-GCM', length: 256 },
		false,
		['decrypt']
	)

	const plaintextBytes = await crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv },
		aesKey,
		ciphertextBytes.buffer as ArrayBuffer
	)

	return new Uint8Array(plaintextBytes)
}

function base64ToUint8Array(base64String: string): Uint8Array {
	const cleanBase64 = base64String.trim().replace(/\s/g, '')
	const binaryString = atob(cleanBase64)
	const uint8Array = new Uint8Array(binaryString.length)

	for (let i = 0; i < binaryString.length; i++) {
		uint8Array[i] = binaryString.charCodeAt(i)
	}

	return uint8Array
}

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
	let binary = ''
	const len = uint8Array.byteLength
	const CHUNK_SIZE = 0x8000 // 32k chunks to avoid stack limits
	for (let i = 0; i < len; i += CHUNK_SIZE) {
		const chunk = uint8Array.subarray(i, i + CHUNK_SIZE)
		binary += String.fromCharCode.apply(null, Array.from(chunk))
	}
	return btoa(binary)
}

interface PasswordOptions {
	length?: number
	useUppercase?: boolean
	useLowercase?: boolean
	useNumbers?: boolean
	useSymbols?: boolean
}

function generatePassword(options: PasswordOptions = {}): string {
	const {
		length = 16,
		useUppercase = true,
		useLowercase = true,
		useNumbers = true,
		useSymbols = true
	} = options

	const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
	const numberChars = '0123456789'
	const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

	let charPool = ''
	const mandatoryChars: string[] = []

	if (useUppercase) {
		charPool += uppercaseChars
		mandatoryChars.push(uppercaseChars[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * uppercaseChars.length)])
	}
	if (useLowercase) {
		charPool += lowercaseChars
		mandatoryChars.push(lowercaseChars[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * lowercaseChars.length)])
	}
	if (useNumbers) {
		charPool += numberChars
		mandatoryChars.push(numberChars[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * numberChars.length)])
	}
	if (useSymbols) {
		charPool += symbolChars
		mandatoryChars.push(symbolChars[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * symbolChars.length)])
	}

	if (!charPool) {
		charPool = lowercaseChars + numberChars
	}

	const passwordArray = [...mandatoryChars]
	const randomValues = new Uint32Array(length - mandatoryChars.length)
	crypto.getRandomValues(randomValues)

	for (let i = 0; i < randomValues.length; i++) {
		const randomIndex = Math.floor((randomValues[i] / 4294967296) * charPool.length)
		passwordArray.push(charPool[randomIndex])
	}

	// Shuffle password using Fisher-Yates with crypto random
	const shuffleValues = new Uint32Array(passwordArray.length)
	crypto.getRandomValues(shuffleValues)
	for (let i = passwordArray.length - 1; i > 0; i--) {
		const j = Math.floor((shuffleValues[i] / 4294967296) * (i + 1))
		;[passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]]
	}

	return passwordArray.join('')
}

let clearClipboardTimeout: ReturnType<typeof setTimeout> | null = null
async function copyToClipboard(text: string, autoClearSeconds = 30): Promise<void> {
	await navigator.clipboard.writeText(text)
	if (clearClipboardTimeout) {
		clearTimeout(clearClipboardTimeout)
	}
	if (autoClearSeconds > 0) {
		clearClipboardTimeout = setTimeout(async () => {
			try {
				const currentText = await navigator.clipboard.readText()
				if (currentText === text) {
					await navigator.clipboard.writeText('')
				}
			} catch {
				// Clipboard API read permissions might be denied, ignore
			}
		}, autoClearSeconds * 1000)
	}
}

export {
	encryptWith_AES_GCM,
	decryptWith_AES_GCM,
	base64ToUint8Array,
	uint8ArrayToBase64,
	generatePassword,
	copyToClipboard
}
