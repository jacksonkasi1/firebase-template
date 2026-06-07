# Setup Guide — Firebase Template

This guide walks you through getting the project running locally from scratch.

---

## Prerequisites

- [Bun](https://bun.sh) ≥ 1.0 (`curl -fsSL https://bun.sh/install | bash`)
- [Node.js](https://nodejs.org) ≥ 18 (for Firebase CLI)
- A [Firebase](https://console.firebase.google.com) project

---

## 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/firebase-template.git
cd firebase-template

# Install frontend deps
cd web/firebase-template && bun install

# Install server deps
cd ../../server && bun install
```

---

## 2. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** → name it → disable Analytics (optional)
3. Enable **Authentication**:
   - Build → Authentication → Get started
   - Sign-in methods → **Email/Password** → Enable
4. Enable **Firestore**:
   - Build → Firestore Database → Create database
   - Start in **test mode** for development (apply rules later)

---

## 3. Frontend — Web Config

1. Firebase Console → Project Settings (⚙️) → **General** tab
2. Under **"Your apps"**, click **Add app** → Web
3. Register the app (nickname: `web`)
4. Copy the `firebaseConfig` object

```bash
# In web/firebase-template/
cp .env.example .env
```

Edit `.env` and fill in the values:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_SERVER_URL=http://localhost:3000
```

---

## 4. Server — Admin SDK Config

1. Firebase Console → Project Settings → **Service accounts** tab
2. Click **"Generate new private key"** → download the JSON file
3. **Do NOT commit this JSON file to git**

```bash
# In server/
cp .env.example .env
```

Open the downloaded JSON and map fields to `.env`:

```env
FIREBASE_PROJECT_ID=          # project_id
FIREBASE_PRIVATE_KEY_ID=      # private_key_id
FIREBASE_PRIVATE_KEY=         # private_key (keep the \n escape sequences)
FIREBASE_CLIENT_EMAIL=        # client_email
FIREBASE_CLIENT_ID=           # client_id
FIREBASE_CLIENT_CERT_URL=     # client_x509_cert_url
```

---

## 5. Deploy Firestore Rules

```bash
# Install Firebase CLI (once)
npm install -g firebase-tools

# Login
firebase login

# From the server/ directory
cd server
firebase use your-project-id
firebase deploy --only firestore:rules
```

---

## 6. Run Locally

```bash
# Terminal 1 — Frontend
cd web/firebase-template
bun run dev        # http://localhost:5173

# Terminal 2 — Server
cd server
bun run dev        # http://localhost:3000
```

Visit http://localhost:5173 — you should see the login page.

---

## 7. Verify Everything Works

1. Register a new account
2. Log in → you should see the dashboard
3. Add, toggle, and delete a todo
4. Visit `/profile` to see your user info
5. Sign out and try "Forgot password"

---

## Common Issues

| Problem | Fix |
|---|---|
| `Missing Firebase config` | Check `.env` values in `web/firebase-template/.env` |
| `401 Unauthorized` from server | Ensure `VITE_SERVER_URL` points to running server |
| `Firebase Admin error` | Check `server/.env` private key (preserve `\n` escapes) |
| `CORS error` | Ensure `FRONTEND_URL` in `server/.env` matches your frontend URL |
