# Password Manager

A client-side-only password manager. All data stays in the browser — no server, no backend, no accounts.

## Features

- Add, view, and update credential records (name, URL, username, email, password, mobile, notes)
- Copy fields to clipboard; show/hide password toggle; open URL in new tab
- Export records to an encrypted file (AES-GCM 256-bit via Web Crypto API)
- Import records back from the encrypted file with the same password

## Stack

- **React 19** — UI
- **Vite 6** — build tool
- **Tailwind CSS 4** — styling
- **Web Crypto API** — AES-GCM encryption with PBKDF2 key derivation (480k iterations, SHA-256)

## Package Manager

This project uses **[Bun](https://bun.sh)**.

```sh
bun install      # install dependencies
bun run dev      # start dev server
bun run build    # production build
bun run preview  # preview production build
bun run lint     # run eslint
```

## Encryption Format

Exported files are base64-encoded binary with the layout:

```
[ IV (12 bytes) | Salt (16 bytes) | AES-GCM Ciphertext ]
```

The encryption key is derived from a user-supplied password via PBKDF2.

## Favicon

Generated using [favicon.io](https://favicon.io/favicon-generator/) with the following settings:

- **Text:** a
- **Background:** Circle
- **Font Family:** Funnel Display
- **Font Variant:** Extra-bold 800 Normal
- **Font Size:** 144
- **Font Color:** `#222`
- **Background Color:** `#DDD`

## Deployment

Deployed to GitHub Pages via GitHub Actions on every push to `main`.
