# QuickBite

A full-stack food delivery web application with real-time order tracking, multi-role support, and a complete admin dashboard — built with the MERN stack.

## Tech Stack

| Layer    | Tech                                               |
| -------- | -------------------------------------------------- |
| Frontend | React 19, Vite 8, Tailwind CSS v4, Socket.IO       |
| Backend  | Node.js, Express 5, Socket.IO, Mongoose 9          |
| Database | MongoDB (Atlas or local)                            |
| Storage  | Cloudinary (image uploads)                          |
| Email    | Brevo (Sendinblue) transactional API                |
| Auth     | JWT (HS256) + bcryptjs                              |
| Testing  | Vitest, React Testing Library, @testing-library/jest-dom |

## Features

### Customer
- Browse foods, filter by category, search with autocomplete
- Add to cart, apply coupons, checkout with multiple payment methods
- Track orders in real-time with live status updates (Socket.IO)
- Favorite foods, reorder past orders
- Star ratings and written reviews on dishes
- Browser push notifications on order status changes

### Restaurant Owner
- Dashboard with live stats (today's orders, revenue, menu items)
- Manage menu: add/edit foods with multiple categories, toggle availability
- Update order statuses (Preparing, Out for Delivery) — customers see updates live
- Toggle restaurant open/closed
- Edit restaurant profile (hours, delivery time, license, image)

### Admin
- Dashboard with charts (revenue trend, orders by status, top foods)
- Manage restaurants, foods, categories, coupons, users
- Approve/reject rider and restaurant role applications
- Full order management with status controls

### Rider
- Dashboard with delivery stats
- View available orders, accept pickups, mark as delivered
- Profile page with delivery history

### System
- Role-based access control (Customer, Restaurant, Admin, Rider)
- Real-time order tracking via Socket.IO
- Global + per-route rate limiting (express-rate-limit)
- JWT env validation at startup (min 32 chars, refuses to boot without)
- Code-split routes (React.lazy) — admin/rider/restaurant bundles load on demand
- Image uploads via Cloudinary (Multer + CloudinaryStorage)
- Responsive design with mobile navigation

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (LTS recommended)
- A MongoDB database — local (`mongodb://127.0.0.1:27017/quickbite`) or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

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

`.env` files are **not** committed — each developer creates their own from the examples.

**`server/.env`** (copy from `server/.env.example`):

```env
PORT=5000
MONGO_URI=<your mongodb connection string>
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))">
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=<your cloud name>
CLOUDINARY_API_KEY=<your api key>
CLOUDINARY_API_SECRET=<your api secret>
```

**`client/.env`** (copy from `client/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

> **Warning:** Do not share a database between developers — tokens and data will conflict.
> `JWT_SECRET` must be at least 32 characters or the server refuses to start.

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

## Available Scripts

### Client (`/client`)

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Vite dev server with HMR            |
| `npm run build`     | Production bundle (code-split)      |
| `npm run lint`      | ESLint check                        |
| `npm run test`      | Run Vitest unit tests               |
| `npm run test:watch`| Run tests in watch mode             |

### Server (`/server`)

| Command       | What it does             |
| ------------- | ------------------------ |
| `npm run dev` | Nodemon with auto-restart|
| `npm start`   | Production node           |

## Project Structure

```
QuickBite
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, FoodCard, Pagination, ReviewSection...)
│   │   ├── context/            # React Context (Auth, Cart, Favorites)
│   │   ├── hooks/              # Custom hooks (useLogout, useOrderSocket)
│   │   ├── layouts/            # Page layouts (Main, Admin, Restaurant, Rider)
│   │   ├── pages/              # Route pages (30+ pages)
│   │   ├── routes/             # Route config + guards (AdminRoute, RestaurantRoute, RiderRoute)
│   │   ├── services/           # Axios API layer (one file per domain)
│   │   ├── utils/              # Shared helpers (pricing, orderStatus, format, image)
│   │   └── test/               # Vitest unit tests
│   └── vite.config.js
├── server/                     # Express backend
│   ├── config/                 # DB connection, Cloudinary, Socket.IO
│   ├── controllers/            # Route handlers (13 controllers)
│   ├── middleware/              # Auth, admin, restaurant, rider guards, rate limiter, upload, validate
│   ├── models/                 # Mongoose schemas (10 models)
│   ├── routes/                 # Express routers (12 route groups)
│   ├── utils/                  # Helpers (asyncHandler, errorResponse, mailer, openingHours, pagination)
│   └── validators/             # Joi validation schemas (10 schemas)
└── README.md
```

## API Endpoints

| Method | Endpoint                     | Auth     | Description              |
| ------ | ---------------------------- | -------- | ------------------------ |
| POST   | `/api/auth/register`         | Public   | Register new user        |
| POST   | `/api/auth/login`            | Public   | Login                    |
| GET    | `/api/food/all`              | Public   | Get all foods (paginated)|
| GET    | `/api/food/suggestions`      | Public   | Autocomplete suggestions |
| GET    | `/api/category`              | Public   | Get all categories       |
| POST   | `/api/cart/add`              | Customer | Add item to cart         |
| POST   | `/api/order/place`           | Customer | Place an order           |
| GET    | `/api/review/:foodId`        | Public   | Get reviews for a food   |
| PUT    | `/api/restaurant/owner/update`| Restaurant | Update own restaurant |
| POST   | `/api/rider/deliver/accept/:id`| Rider  | Accept a delivery        |
| PUT    | `/api/admin/order/:id/status`| Admin    | Update order status      |

> Full route list: 12 route groups, 60+ endpoints with Joi validation on all write operations.

## Deployment

### Environment Variables (Production)

```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/quickbite
JWT_SECRET=<64+ char random string>
NODE_ENV=production
CLIENT_URL=https://your-frontend.onrender.com
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
BREVO_API_KEY=xxx
```

### Build & Run

```bash
# Client — deploy dist/ to any static host (Netlify, Vercel, S3)
cd client
npm run build

# Server — deploy to any Node.js host (Render, Railway, Fly.io)
cd server
npm start
```

### Docker (Optional)

```bash
docker compose up --build
```

## Status

Production-ready.