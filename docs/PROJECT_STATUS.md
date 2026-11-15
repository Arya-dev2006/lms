# Project Status

This assessment is based on the source currently present, not on filenames or README claims alone.

## Fully implemented and connected

- React/Vite application shell and route navigation.
- Public landing page, live public stats, catalogue search/filter/pagination, and course detail view.
- Registration, login, logout, session restoration, HttpOnly JWT cookie, and role-based client/server protection.
- Learner enrollment, dashboard, learning screen, video URL rendering, last-accessed lesson, progress percentage, and achievement display.
- Admin login destination, dashboard counts, course list/search, course create/edit/delete, publish flag, and thumbnail upload flow.
- Admin learner search/pagination and aggregate enrollment/progress summaries.
- Mongoose schemas, uniqueness constraints, validation, and centralized API error responses.

## Partially implemented

- Cloudinary uploads are implemented server-side and used by the thumbnail form, but lesson video/PDF upload workflows are not represented in the client UI.
- Admin analytics returns `enrollmentsByCourse`, but the current dashboard renders only summary cards; there is no chart despite `recharts` being installed.
- `/admin/users/:userId` returns detailed progress, but no UI navigates to it.
- Lesson/resource APIs are functional but have no admin authoring pages.
- Course deletion handles lessons but not all dependent records.

## UI only or placeholder

- Admin Settings navigation is an anchor marked “soon”.
- Student My profile navigation is an anchor marked “soon”.
- Landing-page visual preview and “learning streak” are static presentation elements, not live learner data.
- The `ProtectedRoute` component is present but unused by the active route configuration.

## Backend-only or externally callable

- `/admin/ping`.
- Lesson CRUD.
- Resource CRUD.
- Detailed admin user progress.
- `/progress/my-progress`, although the current dashboard uses progress embedded in `/enrollments/my-courses`.

## Not found in the repository

- Automated tests and test scripts.
- Password reset, email verification, profile editing, lesson/resource admin UI, quiz/assessment, payment, comments, notifications, or course deletion cascade.

## Risks and required testing

1. **Secret hygiene:** the example environment file contains credential-shaped values rather than neutral placeholders. Do not copy or publish those values; rotate any real credentials and use local secret storage.
2. **Public lesson listing:** `GET /lessons/course/:courseId` has no authentication or publication check and may reveal lesson metadata for an unpublished course when its ID is known.
3. **Over-broad update payload:** `updateCourse` spreads the request body rather than selecting allowed fields.
4. **Orphaned records:** deleting a course leaves resources, enrollments, and progress unless separately cleaned.
5. **Resource relationship validation:** an optional resource lesson is not checked against the selected course.
6. **CSRF/rate limits:** cookie authentication is present, but no CSRF defense or request-rate limiting is visible.
7. **Error/loading coverage:** several fetch effects intentionally suppress errors or use generic toasts; test unavailable API, expired sessions, malformed IDs, duplicate slugs/orders, empty courses, zero-lesson courses, and upload failures.
8. **Integration tests:** verify every documented client call against a running API and MongoDB, especially enrollment access, admin authorization, Cloudinary-disabled behavior, and achievement idempotency.

## Recommended demonstration path

Seed an admin, create and publish a course, add lessons through the API, register a learner, enroll, complete lessons, and show the dashboard/achievement changes. For a production demonstration, configure MongoDB, a strong JWT secret, and Cloudinary credentials without placing secret values in documentation or source control.
