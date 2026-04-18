# ============================================================
# AgriConnect - MERN Stack Project
# Requirements / Dependencies
# ============================================================
# NOTE: This is a Node.js project, not Python.
#       Use the npm commands below to install all packages.
# ============================================================


# ──────────────────────────────────────────────────────────
# PREREQUISITES (install once on your system)
# ──────────────────────────────────────────────────────────
# • Node.js  >= 18.x   →  https://nodejs.org
# • npm      >= 9.x    (comes with Node.js)
# • MongoDB  >= 6.x    →  https://www.mongodb.com/try/download/community
#   OR use MongoDB Atlas (cloud) — just set MONGODB_URI in .env


# ──────────────────────────────────────────────────────────
# BACKEND  (backend/)
# ──────────────────────────────────────────────────────────

# Runtime dependencies
express          ^5.0.0      # Web framework
mongoose         ^9.4.1      # MongoDB ODM
bcryptjs         ^3.0.3      # Password hashing
jsonwebtoken     ^9.0.3      # JWT auth tokens
cookie-parser    ^1.4.7      # Cookie middleware
cors             ^2.8.5      # Cross-Origin Resource Sharing
imagekit         ^6.0.0      # ImageKit SDK for image uploads
pino             ^9.0.0      # Logger
pino-http        ^10.0.0     # HTTP request logger middleware
pino-pretty      ^13.0.0     # Pretty-print logs in development


# ──────────────────────────────────────────────────────────
# FRONTEND  (frontend/)
# ──────────────────────────────────────────────────────────

# Runtime dependencies
react                        ^19.1.0   # UI library
react-dom                    ^19.1.0   # DOM renderer
react-hook-form              ^7.56.3   # Form state management
@hookform/resolvers          ^5.0.1    # Zod resolver for react-hook-form
zod                          ^3.24.4   # Schema validation
wouter                       ^3.7.0    # Lightweight client-side router
@tanstack/react-query        ^5.75.5   # Server state management
lucide-react                 ^0.511.0  # Icon library
date-fns                     ^4.1.0    # Date utilities
clsx                         ^2.1.1    # Conditional class names
tailwind-merge               ^3.3.0    # Merge Tailwind classes
class-variance-authority     ^0.7.1    # Component variant builder

# Radix UI headless components
@radix-ui/react-avatar       ^1.1.10
@radix-ui/react-checkbox     ^1.1.5
@radix-ui/react-dialog       ^1.1.14
@radix-ui/react-dropdown-menu ^2.1.15
@radix-ui/react-label        ^2.1.4
@radix-ui/react-progress     ^1.1.4
@radix-ui/react-scroll-area  ^1.2.9
@radix-ui/react-select       ^2.2.5
@radix-ui/react-separator    ^1.1.4
@radix-ui/react-slot         ^1.2.3
@radix-ui/react-tabs         ^1.1.12
@radix-ui/react-toast        ^1.2.14
@radix-ui/react-tooltip      ^1.2.7

# Dev dependencies (build tools)
vite                         ^7.3.1    # Build tool / dev server
@vitejs/plugin-react         ^4.4.1    # Vite React plugin
tailwindcss                  ^4.1.7    # CSS framework
@tailwindcss/vite            ^4.1.7    # Tailwind Vite plugin
@tailwindcss/typography      ^0.5.16   # Typography plugin
tw-animate-css               ^1.2.9    # Tailwind animation utilities
typescript                   ^5.8.3    # TypeScript (used by Vite build)
@types/node                  ^22.0.0
@types/react                 ^19.1.4
@types/react-dom             ^19.1.2


# ──────────────────────────────────────────────────────────
# ROOT (project root)
# ──────────────────────────────────────────────────────────
concurrently    ^9.0.0    # Run backend & frontend dev servers together


# ══════════════════════════════════════════════════════════
# INSTALL COMMANDS
# ══════════════════════════════════════════════════════════

# ── Option A: Install everything at once (recommended) ────
#
#   cd /path/to/AgriConnect
#   npm install
#   cd backend && npm install
#   cd ../frontend && npm install
#
# OR use the shortcut script:
#   npm run install:all

# ── Option B: Install individually ────────────────────────

# 1. Root (installs concurrently)
#   cd AgriConnect
#   npm install

# 2. Backend
#   cd AgriConnect/backend
#   npm install

# 3. Frontend
#   cd AgriConnect/frontend
#   npm install

# ── Backend only (one-liner) ──────────────────────────────
#   npm install express mongoose bcryptjs jsonwebtoken cookie-parser cors imagekit pino pino-http pino-pretty

# ── Frontend only (one-liner) ─────────────────────────────
#   npm install react react-dom react-hook-form @hookform/resolvers zod wouter @tanstack/react-query lucide-react date-fns clsx tailwind-merge class-variance-authority @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-progress @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip


# ══════════════════════════════════════════════════════════
# ENVIRONMENT SETUP
# ══════════════════════════════════════════════════════════

# Copy example env files and fill in your values:
#
#   cp backend/.env.example backend/.env
#   cp frontend/.env.example frontend/.env
#
# Required variables in backend/.env:
#   PORT=5000
#   MONGODB_URI=mongodb://localhost:27017/agriconnect
#   SESSION_SECRET=your_jwt_secret_here
#   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
#   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
#   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id


# ══════════════════════════════════════════════════════════
# RUNNING THE PROJECT
# ══════════════════════════════════════════════════════════

# Run both backend + frontend together (from project root):
#   npm run dev

# Run backend only:
#   npm run dev:backend
#   (or: cd backend && npm run dev)

# Run frontend only:
#   npm run dev:frontend
#   (or: cd frontend && npm run dev)
