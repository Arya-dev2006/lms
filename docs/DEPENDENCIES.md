# Dependencies

Versions below are those declared in the workspace manifests.

## Root

| Package | Version | Type | Purpose/usage |
|---|---:|---|---|
| `concurrently` | `^9.1.2` | Development | Runs client and server dev scripts together |

## Client production dependencies

| Package | Version | Usage |
|---|---:|---|
| `@vitejs/plugin-react` | `^5.1.1` | Vite React transform/plugin configuration |
| `axios` | `^1.13.2` | Shared API client in `services/api.js` |
| `lucide-react` | `^0.468.0` | Icons throughout layouts and pages |
| `react` | `^19.2.0` | Components, hooks, context, rendering |
| `react-dom` | `^19.2.0` | `createRoot` browser mounting |
| `react-hot-toast` | `^2.6.0` | Toast notifications and `Toaster` |
| `react-router-dom` | `^7.9.5` | Browser router, routes, links, navigation |
| `recharts` | `^2.15.4` | Declared but not imported by current source |

## Client development dependencies

| Package | Version | Usage |
|---|---:|---|
| `vite` | `^8.3.6` | Dev server and production build |

## Server production dependencies

| Package | Version | Usage |
|---|---:|---|
| `bcryptjs` | `^3.0.2` | Hashes and verifies passwords |
| `cloudinary` | `^2.7.0` | Optional asset upload destination |
| `cookie-parser` | `^1.4.7` | Reads JWT cookies |
| `cors` | `^2.8.5` | Credentialed client/API cross-origin requests |
| `dotenv` | `^16.4.7` | Loads `.env` variables |
| `express` | `^5.1.0` | HTTP server, middleware, routing |
| `jsonwebtoken` | `^9.0.2` | Signs/verifies session JWTs |
| `learnsphere` | `file:..` | Local root package reference declared by server |
| `mongoose` | `^8.19.3` | MongoDB connection, schemas, queries |
| `multer` | `^2.0.2` | Multipart parsing and upload validation |

## Server development dependencies

| Package | Version | Usage |
|---|---:|---|
| `nodemon` | `^3.1.10` | Restarts API during development |

## Scripts

- Root `npm run install:all`: installs root, client, and server packages.
- Root `npm run dev`: runs both workspaces through `concurrently`.
- Root `npm run build`: builds the client.
- Client `npm run dev/build/preview`: Vite development/build/preview.
- Server `npm run dev/start`: nodemon or Node server.
- Server `npm run seed:admin`: executes `scripts/seedAdmin.js`.
