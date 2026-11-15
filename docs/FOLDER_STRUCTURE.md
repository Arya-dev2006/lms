# Folder Structure

The following is the relevant tracked/project structure. Generated `node_modules` content is omitted.

```text
learnsphere/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── client/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── style.css
│       ├── components/
│       │   ├── AdminLayout.jsx
│       │   ├── Logo.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── PublicNav.jsx
│       │   └── StudentLayout.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── Achievements.jsx
│       │   ├── AdminCourseForm.jsx
│       │   ├── AdminCourses.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminUsers.jsx
│       │   ├── AuthPage.jsx
│       │   ├── CourseCatalog.jsx
│       │   ├── CourseDetails.jsx
│       │   ├── CourseLearning.jsx
│       │   ├── LandingPage.jsx
│       │   └── StudentDashboard.jsx
│       └── services/
│           └── api.js
├── server/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── scripts/seedAdmin.js
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/env.js
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── utils/
└── docs/
    └── generated technical documentation
```

## Root files

- `package.json`: workspace scripts for installing all packages, running both dev servers, building the client, and targeting either workspace.
- `.env.example`: points developers to `server/.env` and `client/.env`; it contains no application settings itself.
- `README.md`: setup, seed, endpoint, upload, and verification instructions.
- `.gitignore`: repository ignore rules.

## Client files

- `client/index.html`: Vite HTML shell containing the `root` element.
- `client/vite.config.js`: enables the React plugin and fixes the dev port at 5173.
- `client/src/main.jsx`: React entry point, global providers, routes, and toast container.
- `client/src/style.css`: global reset, design tokens, marketing/auth/admin/student layouts, forms, cards, progress UI, animation, and responsive media queries.
- `client/src/services/api.js`: shared Axios instance and API base URL.
- `client/src/context/AuthContext.jsx`: initial session lookup plus login, registration, and logout actions.
- `components/Logo.jsx`: reusable home link/brand.
- `components/PublicNav.jsx`: public navigation and mobile menu.
- `components/StudentLayout.jsx`: authenticated learner sidebar and logout.
- `components/AdminLayout.jsx`: authenticated administrator sidebar and logout.
- `components/ProtectedRoute.jsx`: generic protected wrapper; currently unused by `main.jsx`.
- `pages/*.jsx`: route-level screens. Their imports and API calls are documented in [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md).

## Server files

- `src/server.js`: loads environment variables, connects Mongoose, and starts Express.
- `src/app.js`: middleware, health endpoint, route mounting, 404 response, and centralized error response.
- `src/config/env.js`: environment loading, required-variable validation, and configuration object.
- `src/routes/`: URL-to-middleware/controller mappings.
- `src/controllers/`: request validation, Mongoose operations, and JSON responses.
- `src/models/`: Mongoose schemas and collection constraints.
- `src/middleware/auth.js`: JWT-cookie authentication and role checks.
- `src/middleware/upload.js`: in-memory multipart file validation and 100 MB limit.
- `src/utils/auth.js`: token signing and cookie lifecycle.
- `src/utils/courseAccess.js`: enrollment/admin gate for learning resources.
- `src/utils/achievements.js`: idempotent achievement awarding rules.
- `scripts/seedAdmin.js`: hashes configured admin credentials and upserts an admin user.

All server route/controller/model connections are listed in [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md).
