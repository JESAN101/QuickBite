# QuickBite

A full-stack food delivery web application built with the MERN Stack.

## Tech Stack

- React (Vite)
- Node.js / Express
- MongoDB (Mongoose)
- Tailwind CSS

## Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ (LTS recommended)
- A MongoDB database — local (`mongodb://127.0.0.1:27017/quickbite`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## Getting Started

### 1. Clone & install dependencies

```bash
git clone <repo-url>
cd QuickBite

# server deps
cd server
npm install

# client deps
cd ../client
npm install
```

### 2. Configure environment variables

`.env` files are **not** committed to git — each developer creates their own from the examples.

**`server/.env`** (copy from `server/.env.example`):

```env
PORT=5000
MONGO_URI=<your own mongodb connection string>
JWT_SECRET=<any long random string>
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**`client/.env`** (copy from `client/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ If two developers point at the *same* database they will overwrite each
> other's data. Use your **own** database locally. Also note: tokens signed with
> a different `JWT_SECRET` become invalid — if you get random `401 Unauthorized`
> errors after changing secrets or databases, log out and log back in.

### 3. Run the app (two terminals)

```bash
# terminal 1 — API on http://localhost:5000
cd server
npm run dev

# terminal 2 — client on http://localhost:5173
cd client
npm run dev
```

Open http://localhost:5173

## Useful Commands

| Where  | Command         | What it does            |
| ------ | --------------- | ----------------------- |
| client | `npm run dev`   | Vite dev server         |
| client | `npm run lint`  | ESLint check            |
| client | `npm run build` | Production bundle       |
| server | `npm run dev`   | Nodemon auto-restart    |
| server | `npm start`     | Plain node              |

## Status

🚧 Project in active development.
