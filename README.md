# Boycott Companion App 🇵🇸

A shopping companion app helping people identify boycotted products, understand why, and find alternatives - supporting the solidarity movement with Gaza.

## Overview

This project consists of:
- **Backend API** - Node.js/Express REST API with PostgreSQL
- **Web App** - React web application (for Client 2)
- **Mobile App** - Flutter mobile app (for Client 1) - *Coming soon*

## Features

### Core Features
- 🔍 **Product Scanner** - Scan barcodes to check product status
- 🏢 **Company Explorer** - View ownership chains and brand connections
- 🔄 **Alternatives Finder** - Find replacements for boycotted products
- 📍 **Store Locator** - Find where alternatives are available
- 📊 **Evidence-Based** - All claims backed by verifiable sources

### Community Features
- 📝 **Submissions** - Suggest new products/companies with evidence
- 🗳️ **Voting** - Community voting on submission quality
- 🏆 **Gamification** - Points, levels, and badges for contributors
- 👥 **Leaderboards** - Track top contributors

### Localization
- 🌐 **Bilingual** - Full Arabic and English support
- 🗺️ **Libya-focused** - Libyan cities and local stores
- 💱 **Local Currency** - Prices in LYD

## Project Structure

```
boycott-project/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── middleware/     # Express middleware
│   │   ├── database/       # Prisma client & seed data
│   │   └── services/       # Business logic
│   └── prisma/             # Database schema
│
├── web/                     # React web app
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand state
│   │   └── lib/            # Utilities
│   └── public/             # Static assets
│
└── mobile/                  # Flutter app (coming soon)
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your database credentials

npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

### Web App Setup

```bash
cd web
npm install
npm run dev
```

## API Documentation

See [backend/README.md](backend/README.md) for full API documentation.

### Key Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/products/barcode/:barcode` | Scan product by barcode |
| `GET /api/search?q=query` | Search products/companies |
| `GET /api/companies/:id/ownership` | Get ownership chain |
| `GET /api/alternatives/product/:id` | Get alternatives |
| `GET /api/stores?city=tripoli` | Get stores in city |

## Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Web App
- React 18 + TypeScript
- Vite
- TailwindCSS
- Zustand (state)
- TanStack Query (data fetching)
- Framer Motion (animations)

### Mobile App (Planned)
- Flutter
- Dart

## Delivery

This project is designed for two separate clients:

1. **Client 1** receives: `mobile/` + `backend/` + seed database
2. **Client 2** receives: `web/` + `backend/` + seed database

Each client gets an independent copy of the backend with the same initial seed data.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC

---

Made with ❤️ in solidarity with Palestine 🇵🇸

