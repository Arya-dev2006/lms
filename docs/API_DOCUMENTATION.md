# API Documentation

Base URL: `http://localhost:5000/api` by default. JSON responses use `{ success: boolean, ... }`. Authentication uses the `learnsphere_token` HttpOnly cookie, automatically sent by the configured Axios client.

## Authentication and public endpoints

| Method | Endpoint | Purpose | Auth | Controller |
|---|---|---|---|---|
| GET | `/health` | API health check | None | inline `app.js` handler |
| POST | `/auth/register` | Create learner and session | None | `register` |
| POST | `/auth/login` | Verify credentials and create session | None | `login` |
| POST | `/auth/logout` | Clear session cookie | None | `logout` |
| GET | `/auth/me` | Return current public user | JWT | `getMe` |
| GET | `/courses/stats` | Public counts | None | `publicStats` |
| GET | `/courses` | Published course list; admin sees all when authenticated | Optional JWT | `listCourses` |
| GET | `/courses/:id` | Course and ordered lessons | Optional JWT | `getCourse` |

Registration body: `name`, `email`, `password`, `confirmPassword`. Success is `201` with `{ success, user }`; mismatched details/password under 8 characters return `400`; duplicate email returns `409`.

Login body: `email`, `password`. Success returns `{ success, user }`; invalid credentials return `401`.

Course list query: `search`, `category`, `difficulty`, `page`, `limit` (limit is capped at 50). Response: `{ courses, pagination: { page, limit, total, pages } }`.

## Admin endpoints

| Method | Endpoint | Purpose | Auth | Controller |
|---|---|---|---|---|
| GET | `/admin/ping` | Authorization smoke test | JWT + admin | inline handler |
| GET | `/admin/courses` | Admin course list | JWT + admin | `listCourses` |
| GET | `/admin/analytics` | Counts and top enrollment courses | JWT + admin | `dashboardAnalytics` |
| GET | `/admin/users` | Search/paginate learners and aggregates | JWT + admin | `listUsers` |
| GET | `/admin/users/:userId` | One learner and progress records | JWT + admin | `userProgress` |
| POST | `/courses` | Create course | JWT + admin | `createCourse` |
| PUT | `/courses/:id` | Update course | JWT + admin | `updateCourse` |
| DELETE | `/courses/:id` | Delete course and its lessons | JWT + admin | `deleteCourse` |
| POST | `/uploads` | Upload one asset | JWT + admin + `file` multipart | `uploadAsset` |

Course create/update fields are `title`, `description`, `category`, `difficulty`, `instructor`, `objectives` (array), `thumbnail`, and `isPublished`. Create returns `201 { success, course }`; update returns `{ success, course }`.

`/admin/users` accepts `search`, `page`, and `limit`; its user records include `enrolledCourses`, `completed`, and average completion. `/admin/users/:userId` returns `{ user, progress }`.

Upload accepts field `file`, allows JPEG/PNG/WebP/MP4/WebM/PDF, and caps the in-memory buffer at 100 MB. Success returns `{ asset: { url, publicId, resourceType } }`; local-disk responses also include `storage: "local"`. With all three Cloudinary variables configured, the buffer is streamed to the `learnsphere` Cloudinary folder. Otherwise, the controller creates `<server working directory>\uploads`, writes a UUID-based filename while preserving the lower-case extension, and serves the file through `/uploads/<filename>`.

## Course authoring endpoints

| Method | Endpoint | Purpose | Auth | Controller |
|---|---|---|---|---|
| GET | `/lessons/course/:courseId` | List ordered lessons | None | `listLessons` |
| POST | `/lessons` | Create lesson | JWT + admin | `createLesson` |
| PUT | `/lessons/:id` | Update lesson | JWT + admin | `updateLesson` |
| DELETE | `/lessons/:id` | Delete lesson | JWT + admin | `deleteLesson` |
| GET | `/resources/course/:courseId` | List course resources | JWT + enrollment/admin | `listResources` |
| POST | `/resources` | Create resource metadata | JWT + admin | `createResource` |
| DELETE | `/resources/:id` | Delete resource metadata | JWT + admin | `deleteResource` |

Lesson create fields: `course`, `title`, `description`, `videoUrl`, `duration`, `order`, `module`, `isPreview`. Resource create fields: `title`, `description`, `fileUrl`, `fileType`, `course`, and optional `lesson`.

## Learner endpoints

| Method | Endpoint | Purpose | Auth | Controller |
|---|---|---|---|---|
| POST | `/enrollments` | Enroll in published course | JWT | `enroll` |
| GET | `/enrollments/my-courses` | Learner courses plus progress | JWT | `listMyCourses` |
| GET | `/enrollments/course/:courseId` | Enrollment/progress check | JWT | `getEnrollment` |
| GET | `/enrollments/course/:courseId/learning` | Course lessons and learner progress | JWT + enrollment/admin | `getCourseLearningData` |
| GET | `/progress/my-progress` | All learner progress | JWT | `getMyProgress` |
| POST | `/progress/:courseId/complete-lesson/:lessonId` | Mark lesson complete | JWT; controller verifies enrollment | `completeLesson` |
| PUT | `/progress/:courseId/last-accessed/:lessonId` | Save current lesson | JWT; controller verifies enrollment | `updateLastAccessed` |
| GET | `/achievements/my-achievements` | Learner achievements | JWT | `listMyAchievements` |

Enrollment body: `{ course }`. Completion and last-accessed identifiers are URL parameters. Course learning returns `{ course, lessons, progress }`; completion returns `{ progress }`.

## Common errors

`401` means no/invalid/expired cookie, `403` means insufficient role or course access, `404` means missing route/resource, `409` means duplicate record, and `400` means validation, malformed identifier, or upload error. The final Express error handler maps Mongoose validation errors to `400`, duplicate keys to `409`, cast errors to `400`, Multer/unsupported types to `400`, and unknown errors to `500`.
