# Production Deployment Guide — Firebase Template

This guide outlines essential steps, best practices, and security checklists for preparing and deploying this project to production.

---

## 1. Database (Cloud Firestore)

In production, your database must be secured and optimized for scale.

### A. Production Rules
Never leave your database in "Test Mode". You must deploy the strict security rules from [firestore.rules](file:///Users/jacksonnkasi/Desktop/code/firebase-template/server/firestore.rules).
- Run the following command from the `server` directory to deploy rules:
  ```bash
  bunx firebase deploy --only firestore:rules
  ```

### B. Indexes
Since query sorting requires composite indexes:
- Ensure you deploy the composite index configuration defined in [firestore.indexes.json](file:///Users/jacksonnkasi/Desktop/code/firebase-template/server/firestore.indexes.json):
  ```bash
  bunx firebase deploy --only firestore:indexes
  ```
- Alternatively, if you see a `FAILED_PRECONDITION` error in logs for a new query, click the generated link in the error to create the index in the Firebase Console.

---

## 2. Authentication (Auth)

### A. Authorized Domains
By default, Firebase allows authentication from localhost and your `firebaseapp.com` domain.
1. Go to **Firebase Console** → **Authentication** → **Settings** → **Authorized domains**.
2. Add your production domain (e.g., `app.yourdomain.com`).
3. Remove localhost/development domains in your production project if you use separate Firebase projects for dev and prod (highly recommended).

### B. Custom Domain & Email Templates (Trust & Deliverability)
For password reset and sign-up emails:
1. **Custom Domain for Action Links**: In **Authentication** → **Templates** → **Password reset**, click **Edit template** (pencil icon) → **Customize action URL**. Set it to use your custom domain so users are redirected to your domain rather than `firbs-template.firebaseapp.com`.
2. **SMTP / Email Delivery**: In **Authentication** → **Templates**, click **SMTP settings** and configure a custom SMTP server (like SendGrid, Mailgun, or Postmark) to send reset links. Using the default Firebase mail server has lower deliverability rates.

---

## 3. Environment Variables & Secret Management

**CRITICAL: Never commit environment files (`.env`) or service account JSON credentials to GitHub.**

### A. Local Git Protection
We have pre-configured [root .gitignore](file:///Users/jacksonnkasi/Desktop/code/firebase-template/.gitignore) to automatically block:
- All `.env` and `.env.local` files
- Firebase service account JSON files (`*-firebase-adminsdk-*.json`)

### B. Cloud Hosting Secrets
When deploying to cloud platforms (such as Fly.io, Vercel, Heroku, or GCP):
1. **Do not use `.env` files** in your server build.
2. Store server credentials (like `FIREBASE_PRIVATE_KEY` and `FIREBASE_CLIENT_EMAIL`) directly as **Environment Variables / Secrets** in your hosting provider's dashboard or CLI (e.g. `fly secrets set` or Vercel Environment Variables).
3. Ensure the `FIREBASE_PRIVATE_KEY` maintains its correct formatting (specifically replacing escaped `\n` characters if your provider parses them literally).

---

## 4. Firebase CLI Deployment

Deploy rules and indexes directly from your CI/CD pipeline (such as GitHub Actions) to prevent manual errors:
1. Install `firebase-tools` locally:
   ```bash
   bun install
   ```
2. Generate a Firebase CI token:
   ```bash
   bunx firebase login:ci
   ```
3. Save the returned token as a secret named `FIREBASE_TOKEN` in your repository settings (e.g., GitHub Secrets).
4. Create a CI workflow to run:
   ```bash
   bunx firebase deploy --only firestore --token "$FIREBASE_TOKEN"
   ```
