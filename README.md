# AgriConnect — Assured Contract Farming System

A full-stack MERN platform connecting farmers and buyers through guaranteed contract farming, a crop marketplace, real-time messaging, and contract management.

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 19 + Vite + TypeScript      |
| Backend  | Node.js + Express 5 + TypeScript  |
| Database | MongoDB + Mongoose                |
| Auth     | JWT + bcryptjs                    |
| Images   | ImageKit (cloud image storage)    |
| Styling  | Tailwind CSS v4 + shadcn/ui       |

## Project Structure

```
AgriConnect/
├── server/                     # Express + MongoDB backend
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.ts         # User model (farmer/buyer roles)
│   │   │   ├── Crop.ts         # Crop listing model
│   │   │   ├── Contract.ts     # Contract model
│   │   │   └── Message.ts      # Message model
│   │   ├── routes/
│   │   │   ├── auth.ts         # Register, login, profile update
│   │   │   ├── crops.ts        # Crop CRUD
│   │   │   ├── contracts.ts    # Contract management
│   │   │   ├── messages.ts     # Messaging + conversations
│   │   │   ├── dashboard.ts    # Summary & recent activity
│   │   │   ├── upload.ts       # ImageKit auth endpoint
│   │   │   └── index.ts        # Route aggregator
│   │   ├── lib/
│   │   │   └── auth.ts         # JWT middleware & helpers
│   │   ├── app.ts              # Express app config
│   │   └── index.ts            # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui primitives
│   │   │   ├── auth-provider.tsx
│   │   │   ├── image-upload.tsx  # ImageKit direct upload
│   │   │   ├── layout.tsx
│   │   │   └── theme-provider.tsx
│   │   ├── pages/
│   │   │   ├── home.tsx        # Landing page
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── marketplace.tsx
│   │   │   ├── crop-detail.tsx
│   │   │   ├── create-crop.tsx
│   │   │   ├── contracts.tsx
│   │   │   ├── contract-detail.tsx
│   │   │   ├── messages.tsx
│   │   │   └── profile.tsx
│   │   ├── hooks/
│   │   │   ├── use-toast.ts
│   │   │   └── use-mobile.tsx
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── App.tsx             # Router setup
│   │   ├── main.tsx
│   │   └── index.css           # Tailwind + green theme vars
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── lib/                        # Shared generated API client
│   ├── api-client-react/       # React Query hooks (auto-generated)
│   └── api-zod/                # Zod validation schemas (auto-generated)
│
└── package.json                # Root: run both server + client together
```

## API Endpoints

### Auth (`/api/auth`)
| Method | Route      | Auth | Description        |
|--------|------------|------|--------------------|
| POST   | /register  | —    | Register new user  |
| POST   | /login     | —    | Login              |
| POST   | /logout    | —    | Logout             |
| GET    | /me        | JWT  | Get current user   |
| PUT    | /profile   | JWT  | Update profile     |

### Crops (`/api/crops`)
| Method | Route  | Auth    | Description         |
|--------|--------|---------|---------------------|
| GET    | /      | —       | List all crops      |
| POST   | /      | Farmer  | Create crop listing |
| GET    | /:id   | —       | Get crop detail     |
| PUT    | /:id   | Farmer  | Update crop         |
| DELETE | /:id   | Farmer  | Delete crop         |

### Contracts (`/api/contracts`)
| Method | Route | Auth  | Description             |
|--------|-------|-------|-------------------------|
| GET    | /     | JWT   | List user contracts     |
| POST   | /     | Buyer | Propose contract        |
| GET    | /:id  | JWT   | Get contract detail     |
| PUT    | /:id  | JWT   | Update contract status  |

### Messages (`/api/messages`)
| Method | Route           | Auth | Description          |
|--------|-----------------|------|----------------------|
| GET    | /               | JWT  | Messages by contract |
| POST   | /               | JWT  | Send message         |
| GET    | /conversations  | JWT  | List conversations   |

### Other
| Method | Route                       | Auth | Description          |
|--------|-----------------------------|------|----------------------|
| GET    | /api/dashboard/summary      | JWT  | Stats summary        |
| GET    | /api/dashboard/recent-activity | JWT | Recent activity   |
| GET    | /api/upload/auth            | JWT  | ImageKit auth params |

## Setup & Running

### 1. Install dependencies

```bash
cd AgriConnect

# Install root + server + client deps
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Set up environment variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/agriconnect
SESSION_SECRET=a-long-random-secret-string
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

### 3. Configure Vite proxy

In `client/vite.config.ts`, the proxy is already set up:
```ts
server: {
  proxy: { '/api': 'http://localhost:8080' }
}
```

### 4. Run in development

```bash
# From root — runs server + client together:
npm run dev

# Or separately:
npm run dev:server    # API → http://localhost:8080
npm run dev:client    # React → http://localhost:5173
```

## Demo Accounts (after seeding)

| Role   | Email                  | Password    |
|--------|------------------------|-------------|
| Farmer | farmer@example.com     | password123 |
| Buyer  | buyer@example.com      | password123 |

## User Roles

- **Farmer** — creates crop listings with photos, receives contract proposals, accepts/rejects, messages buyers
- **Buyer** — browses marketplace, proposes contracts, negotiates terms via in-platform messaging
