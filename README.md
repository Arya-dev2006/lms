# LearnSphere

LearnSphere is a MERN learning management system built in incremental phases.

## Phase 7: integration and production hardening

The application now contains:

- A Vite React client in `client/`
- An Express/Mongoose server in `server/`
- Automatic achievements for first enrollment, first lesson, course completion,
  and completing three courses
- Student achievements page with locked and earned states
- Admin analytics for users, courses, lessons, enrollments, and completions
- Admin learner search, pagination, and progress summaries
- Course catalogue search, category filtering, difficulty filtering, and pagination
- Live public platform statistics
- Cloudinary upload endpoint for admin assets
- Explicit upload configuration and validation errors
- Invalid identifier and malformed upload error responses

Previous phases also include the admin workspace, course CRUD, lesson/resource
models, protected admin APIs, and upload validation middleware.

Previous phases also include secure HttpOnly-cookie JWT authentication,
registration, login, logout, session persistence, protected middleware, and
admin seeding.

## Setup

Requirements: Node.js 20+ and MongoDB (local or Atlas).

```powershell
npm run install:all
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Update `server/.env` with your MongoDB URI and JWT secret. The default MongoDB URI is
`mongodb://127.0.0.1:27017/learnsphere`, so you can replace it later with your Atlas URI.

Start the applications:

```powershell
npm run dev
```

The client runs at `http://localhost:5173` and the API runs at
`http://localhost:5000`. Verify the API with `http://localhost:5000/api/health`.

## Admin seed

Set `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `server/.env`, then run:

```powershell
npm run seed:admin --prefix server
```

Authentication endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Public endpoint:

- `GET /api/courses/stats`

Admin course endpoints:

- `GET /api/admin/courses`
- `POST /api/courses`
- `PUT /api/courses/:id`
- `DELETE /api/courses/:id`
- `GET /api/lessons/course/:courseId`
- `POST /api/lessons`
- `PUT /api/lessons/:id`
- `DELETE /api/lessons/:id`
- `GET /api/resources/course/:courseId`
- `POST /api/resources`
- `DELETE /api/resources/:id`

Student learning endpoints:

- `POST /api/enrollments`
- `GET /api/enrollments/my-courses`
- `GET /api/enrollments/course/:courseId`
- `GET /api/enrollments/course/:courseId/learning`
- `GET /api/progress/my-progress`
- `POST /api/progress/:courseId/complete-lesson/:lessonId`
- `PUT /api/progress/:courseId/last-accessed/:lessonId`

Achievements and administration endpoints:

- `GET /api/achievements/my-achievements`
- `GET /api/admin/analytics`
- `GET /api/admin/users`
- `GET /api/admin/users/:userId`

Upload endpoint:

- `POST /api/uploads` (admin only, multipart field: `file`)

Cloudinary uploads require `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
and `CLOUDINARY_API_SECRET`. If these values are not configured, the endpoint
returns HTTP 503 rather than silently pretending the upload succeeded.

## Verification

The client production build is run with:

```powershell
npm run build
```

The API health check is available at `GET /api/health`. MongoDB-dependent
features require a reachable `MONGO_URI`; replace the example local URI with
your MongoDB Atlas connection string before starting the server.
