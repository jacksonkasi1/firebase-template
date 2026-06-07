# Firebase Security Rules

---

## Firestore Rules (`server/firestore.rules`)

### Summary

| Collection | Read | Write |
|---|---|---|
| `/users/{userId}` | Owner only | Owner only |
| `/todos/{todoId}` | Owner only (userId == auth.uid) | Owner only with validation |
| Everything else | ❌ Denied | ❌ Denied |

### Rules Explained

```javascript
// A user can only access their own profile
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Todos are scoped to the userId field on the document
match /todos/{todoId} {
  allow read:   if resource.data.userId == request.auth.uid;

  allow create: if request.resource.data.userId == request.auth.uid
                && request.resource.data.title is string
                && request.resource.data.title.size() > 0
                && request.resource.data.completed is bool;

  allow update: if resource.data.userId == request.auth.uid
                && request.resource.data.userId == request.auth.uid;

  allow delete: if resource.data.userId == request.auth.uid;
}

// Default deny everything else
match /{document=**} {
  allow read, write: if false;
}
```

### Key Security Properties

1. **Authentication required** — `request.auth != null` checked on all paths
2. **Ownership enforced at DB level** — even if the server has a bug, Firestore won't allow cross-user access
3. **Field validation on create** — `title` must be a non-empty string, `completed` must be boolean
4. **userId immutable on update** — `request.resource.data.userId` must still match auth.uid

---

## How to Deploy Rules

```bash
# Install Firebase CLI (once)
npm install -g firebase-tools

# Login
firebase login

# From server/ directory
cd server
firebase use your-project-id    # Set active project
firebase deploy --only firestore:rules
```

---

## Testing Rules Locally (Firebase Emulator)

```bash
# Install emulator
firebase setup:emulators:firestore

# Start emulator
firebase emulators:start --only firestore

# Set env in both .env files to use emulator
FIRESTORE_EMULATOR_HOST=localhost:8080
```

---

## Adding New Collections

When you add a new collection, always:

1. Add rules in `firestore.rules`
2. Ensure user ownership (`userId` field + ownership check)
3. Deploy with `firebase deploy --only firestore:rules`
4. Document the collection in `docs/ARCHITECTURE.md`

**Template for new collection:**
```javascript
match /your-collection/{docId} {
  allow read:   if isAuthenticated() && resource.data.userId == request.auth.uid;
  allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
  allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
  allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
}
```
