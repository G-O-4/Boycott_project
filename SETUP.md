# Quick Setup Guide

This guide will get you up and running in under 5 minutes.

## Prerequisites

- Node.js 18+ 
- Docker Desktop (recommended) OR PostgreSQL 14+

---

## 🚀 Quick Start (Docker)

### Step 1: Start Database

```bash
cd backend
docker-compose up -d
```

This starts PostgreSQL on port 5432 with:
- User: `postgres`
- Password: `postgres`
- Database: `boycott_db`

### Step 2: Setup Backend

```bash
# Still in backend/
npm install

# Create .env file
cp env.example .env

# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:push

# Seed with initial data (products, companies, alternatives)
npm run db:seed

# Start backend server
npm run dev
```

Backend will be running at http://localhost:3000

### Step 3: Setup Frontend

```bash
# Open new terminal
cd web
npm install
npm run dev
```

Frontend will be running at http://localhost:5173

---

## 🎉 Done!

Open http://localhost:5173 in your browser.

### Test Accounts

Register a new account, or use seeded data:
- Products to scan: `5449000000996` (Coca-Cola), `7622210100535` (Oreo)
- Search for: "كوكا" or "Pepsi"

---

## 🛠️ Development Commands

### Backend

```bash
npm run dev          # Start with hot reload
npm run db:studio    # Open database GUI (Prisma Studio)
npm run db:seed      # Reset and seed database
```

### Frontend

```bash
npm run dev          # Start dev server
npm run build        # Build for production
```

---

## 🔧 Troubleshooting

### "Can't reach database server"

```bash
# Check if Docker is running
docker ps

# Restart database
cd backend
docker-compose down
docker-compose up -d
```

### "Port 5432 already in use"

Another PostgreSQL instance is running. Either:
1. Stop it: `brew services stop postgresql` (macOS)
2. Or change port in `docker-compose.yml`

### "Module not found"

```bash
# Regenerate Prisma client
cd backend
npm run db:generate
```

---

## 📦 Seed Data Included

After running `npm run db:seed`, you'll have:

- **15 Companies** (Coca-Cola, PepsiCo, Nestlé, etc.)
- **35+ Products** (beverages, snacks, personal care)
- **16 Categories** (Beverages, Food, Personal Care, etc.)
- **12 Stores** (Tripoli, Benghazi, Misrata)
- **10+ Alternatives** (RC Cola, Turkish brands, local products)

---

## 🌍 API Test

```bash
# Test API is working
curl http://localhost:3000/api/products/stats

# Should return:
# {"success":true,"data":{"totalProducts":35,...}}
```

---

## Need Help?

Check the main [README.md](./README.md) for full documentation.

