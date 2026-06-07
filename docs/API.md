# API Reference

Base URL: `http://localhost:8080` (development)

All protected routes require:
```
Authorization: Bearer <Firebase ID Token>
```

All responses follow this shape:
```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... }
}
```

---

## Health

### `GET /`
Returns server status.

**Response 200:**
```json
{ "success": true, "message": "Firebase Template Server", "data": { "status": "running", "version": "1.0.0" } }
```

### `GET /health`
```json
{ "success": true, "message": "Success", "data": { "status": "healthy", "timestamp": "2024-01-01T00:00:00.000Z" } }
```

---

## Auth

### `POST /auth/verify-token`
Verifies a Firebase ID token server-side.

**Body:**
```json
{ "token": "<firebase-id-token>" }
```

**Response 200:**
```json
{
  "success": true,
  "data": { "uid": "abc123", "email": "user@example.com", "displayName": "Jackson" }
}
```

**Response 401:**
```json
{ "success": false, "message": "Invalid or expired token" }
```

---

## Todos 🔒 (Protected)

All todo routes require a valid Firebase ID token.

### `GET /todos`
Fetch all todos for the authenticated user, sorted newest first.

**Response 200:**
```json
{
  "success": true,
  "message": "Todos fetched successfully",
  "data": [
    {
      "id": "doc_id",
      "title": "Build the app",
      "completed": false,
      "userId": "uid123",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### `POST /todos`
Create a new todo.

**Body:**
```json
{ "title": "My new task" }
```

**Response 201:**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": { "id": "new_doc_id", "title": "My new task", "completed": false, ... }
}
```

**Response 400:**
```json
{ "success": false, "message": "Validation error", "error": "Title is required" }
```

---

### `PATCH /todos/:id`
Update a todo's title and/or completed state.

**Body (partial):**
```json
{ "title": "Updated title", "completed": true }
```

**Response 200:**
```json
{ "success": true, "message": "Todo updated successfully", "data": { "id": "...", ... } }
```

**Response 403:**
```json
{ "success": false, "message": "Forbidden" }
```

**Response 404:**
```json
{ "success": false, "message": "Todo not found" }
```

---

### `DELETE /todos/:id`
Delete a todo owned by the authenticated user.

**Response 200:**
```json
{ "success": true, "message": "Todo deleted successfully", "data": null }
```

---

## Error Codes

| Status | Meaning |
|---|---|
| 400 | Validation error — check request body |
| 401 | Missing or invalid Bearer token |
| 403 | Authenticated but not the owner |
| 404 | Resource not found |
| 500 | Server error — check server logs |
