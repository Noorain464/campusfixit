# CampusFixIt

CampusFixIt is a small mobile/web app (built with Expo + React Native) paired with an Express + MongoDB backend API. It lets users (students) create and manage campus issues and lets administrators view and update issue status.

## Contents

- `app/` — Expo Router app (TypeScript + React Native + Nativewind)
- `app-example/` — Starter/example app preserved from scaffolding
- `server/` — Express API, MongoDB models, controllers, and routes
- `assets/` — Images and static assets
- `utils/api.js` — client helper for API calls

## Quick start

Prerequisites:

- Node.js (>=16)
- npm
- For iOS simulator: Xcode (macOS)

1. Install root dependencies (client):

```bash
npm install
```

2. Install server dependencies:

```bash
cd server
npm install
cd ..
```

3. Run the backend (from `server/`):

```bash
cd server
# development with auto-reload
npm run dev
# or in production
npm start
```

The API will listen on port `3000` by default.

4. Run the Expo app (from project root):

```bash
npm start
```

Open the project in Expo Go, an emulator, or a development build. For Android emulator or iOS simulator use `npm run android` / `npm run ios`.

## Environment (server)

Create a `.env` file in `server/` with at least:

```
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-strong-secret>
```

The server currently reads `MONGODB_URI` and `JWT_SECRET` from the environment.

## API overview

Base URL: `http://localhost:3000/api`

Auth:

- POST `/auth/register` — Register a new user. Body: `{ name, email, password }`.
- POST `/auth/login` — Login. Body: `{ email, password }`. Returns a JWT token.
- GET `/auth/me` — Protected. Returns current user. Send `Authorization: Bearer <token>` header.

Issues:

- POST `/issues/` — Create issue (student). Protected. Form data: `title`, `description`, `category`, optional `image` (multipart).
- GET `/issues/my` — Get issues created by the authenticated user. Protected.
- GET `/issues/` — Admin only: list all issues.
- PATCH `/issues/:id` — Admin only: update status/remarks of an issue. Body: `{ status, remarks }`.

Authentication: use the `Authorization` header with a Bearer token returned on login/register.

Error handling: the server returns JSON { message } on errors and logs unhandled errors to the console.

## Notable implementation details

- Images uploaded via `multer` are stored under `server/uploads/` by default (see `server/middleware/upload.js`).
- Database connection is handled in `server/config/dbconfig.js` using `process.env.MONGODB_URI`.
- JWT secret is read from `process.env.JWT_SECRET` in `server/controllers/auth.controller.js`.

## Development notes

- The Expo app uses file-based routing in `app/` (see `app/(tabs)`, `app/(auth)` etc.).
- Example starter code is preserved in `app-example/`.
- To reset the project starter files, run `npm run reset-project`.

## Folder reference

- `app/` — mobile/web app source
- `server/` — API source
  - `server/models/` — Mongoose models (`user.model.js`, `issue.model.js`)
  - `server/controllers/` — request handlers
  - `server/routes/` — Express routes
  - `server/middleware/` — auth, admin check, upload

## Testing & next steps

- Seed data / test users: create via `/auth/register` or add seeding script.
- Consider making `PORT` configurable in `server/index.js` and reading it from `.env`.

## Contributing

PRs and issues welcome. If adding features, include tests and update this README with required env/config changes.

## License

This repository does not include a license file. Add one if you intend to open-source the project.

---

File: [README_FULL.md](README_FULL.md)
