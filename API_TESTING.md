# Smart Study + Placement Tracker API Testing

Base URL:

```text
http://localhost:8000
```

Use the token returned from register or login for protected routes:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## Auth

### Register User

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### Login User

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

## Study

### Add Study Session

```http
POST /api/study
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

```json
{
  "subject": "Data Structures",
  "durationHours": 2,
  "date": "2026-06-05",
  "notes": "Practiced arrays and linked lists"
}
```

### Get Study Sessions

```http
GET /api/study
Authorization: Bearer YOUR_JWT_TOKEN
```

## Placement

### Create Or Update Placement Progress

```http
POST /api/placement
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

```json
{
  "easySolved": 10,
  "mediumSolved": 5,
  "hardSolved": 1,
  "projectsCompleted": 1,
  "projectsOngoing": 1,
  "aptitudeHours": 3,
  "mockInterviews": 1
}
```

### Get Placement Progress

```http
GET /api/placement
Authorization: Bearer YOUR_JWT_TOKEN
```

## Run Commands

```bash
npm install
npm run dev
```

Before running the server, create a `.env` file using `.env.example` and set:

```text
PORT=8000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
```
