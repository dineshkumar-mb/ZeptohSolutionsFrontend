# Encrypted Dynamic Form

## 🔐 Encryption & Decryption

- **Algorithm:** AES-256-CBC
- **Key:** SHA-256 of `"internsNeverGuess"`
- **Prefix:** `"SALT1234"` added before encryption
- **IV:** Random for each field (shared with the client)

## 🛡️ Decoy Field Detection

- Any field that doesn't match the pattern `label:type` is ignored.
- Regex used: `/^[^:]+:[^:]+$/`

## 🔁 Flow

1. Backend sends encrypted fields.
2. Frontend decrypts and validates them.
3. One input field is shown at a time.
4. Field disappears onBlur, next field appears.
5. Final form auto-submits to backend.

## 🚀 To Run

### Backend
```bash
cd backend
npm install
npm start

### Frontend
cd frontend
npm install
npm run dev
