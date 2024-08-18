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

export {encryptWith_AES_GCM, decryptWith_AES_GCM, base64ToUint8Array}
