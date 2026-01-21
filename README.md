# مقاطعة (Muqata'a) - Boycott Awareness App

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web-orange.svg)

**A community-driven platform to help consumers make informed purchasing decisions through product scanning, boycott awareness, and alternative recommendations.**

[العربية](#arabic-overview) | [English](#english-overview)

</div>

---

<a name="arabic-overview"></a>
## 🇱🇾 نظرة عامة

**مقاطعة** هو تطبيق ويب يساعد المستهلكين على اتخاذ قرارات شراء مدروسة من خلال:

- 📱 **مسح الباركود** - امسح أي منتج لمعرفة حالته
- ✅ **البدائل المحلية** - اكتشف بدائل آمنة ومحلية
- 🏪 **أين تجد البدائل** - خرائط المتاجر التي توفر البدائل
- 👥 **مساهمات المجتمع** - ساهم بإضافة منتجات وبدائل جديدة
- 🏆 **نظام النقاط** - اكسب نقاطًا عند المساهمة

---

<a name="english-overview"></a>
## 🌍 Overview

**Muqata'a** is a web application that helps consumers make informed purchasing decisions through:

- 📱 **Barcode Scanning** - Scan any product to check its status
- ✅ **Local Alternatives** - Discover safe, local alternatives
- 🏪 **Store Locator** - Find stores that carry alternatives
- 👥 **Community Contributions** - Add new products and alternatives
- 🏆 **Points System** - Earn points for contributions

---

## ✨ Features

### For Consumers
- **Product Search** - Search by name, barcode, or brand
- **Verdict System** - Products are labeled as AVOID, CAUTION, or PREFERRED
- **Alternative Recommendations** - Get suggestions for ethical alternatives
- **Store Availability** - See which stores carry alternatives near you
- **Company Transparency** - View ownership chains and claims

### For Contributors
- **Submit Products** - Add new products to the database
- **Submit Alternatives** - Suggest alternatives for boycotted products
- **Submit Evidence** - Provide sources and evidence for claims
- **Earn Reputation** - Build your reputation through verified contributions

### Community Features
- **Leaderboard** - See top contributors
- **Badges** - Earn badges for achievements
- **Activity Feed** - Track community contributions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| TailwindCSS | Styling |
| React Router | Navigation |
| Zustand | State Management |
| Axios | HTTP Client |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| TypeScript | Type Safety |
| Prisma | ORM |
| PostgreSQL | Database |
| JWT | Authentication |
| Zod | Validation |

---

## 📁 Project Structure

```
Boycott_project/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── database/          # Prisma client & seed data
│   │   │   └── seed/          # Database seed files
│   │   ├── middleware/        # Express middleware
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── products/      # Products API
│   │   │   ├── companies/     # Companies API
│   │   │   ├── alternatives/  # Alternatives API
│   │   │   ├── stores/        # Stores API
│   │   │   ├── search/        # Search API
│   │   │   ├── submissions/   # User submissions
│   │   │   └── users/         # User management
│   │   ├── services/          # Business logic
│   │   └── index.ts           # Entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── docker-compose.yml     # PostgreSQL container
│   └── package.json
│
├── web/                        # Frontend Web App
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Zustand stores
│   │   ├── lib/               # Utilities & API client
│   │   └── App.tsx            # Main app component
│   └── package.json
│
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **PostgreSQL** 14+ (or Docker)

### Option 1: Using Docker (Recommended)

Docker makes database setup simple and consistent across all machines.

#### 1. Install Docker Desktop
- **macOS/Windows**: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: `sudo apt install docker.io docker-compose`

#### 2. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd Boycott_project

# Start PostgreSQL with Docker
cd backend
docker-compose up -d

# Install backend dependencies
npm install

# Setup environment
cp env.example .env
# Edit .env if needed (default values work with Docker)

# Generate Prisma client and push schema
npm run db:generate
npm run db:push

# Seed the database with initial data
npm run db:seed

# Start backend server
npm run dev
```

#### 3. Start Frontend

```bash
# In a new terminal
cd web
npm install
npm run dev
```

#### 4. Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

---

### Option 2: Local PostgreSQL Installation

#### macOS (Homebrew)
```bash
brew install postgresql@14
brew services start postgresql@14
createdb boycott_db
```

#### Windows
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer, set password for `postgres` user
3. Create database using pgAdmin or psql

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb boycott_db
```

Then update `.env`:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/boycott_db"
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/boycott_db"

# JWT Secret (change in production!)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5173"
```

### Frontend (`web/.env`)

The frontend uses Vite's proxy to communicate with the backend, so no environment variables are needed for development.

---

## 📜 Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🗄️ Database Schema

### Core Entities

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Company   │────▶│    Brand    │────▶│   Product   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                       │
       │                                       ▼
       │                              ┌─────────────┐
       └─────────────────────────────▶│ Alternative │
                                      └─────────────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │    Store    │
                                      └─────────────┘
```

### Key Models

| Model | Description |
|-------|-------------|
| `User` | Registered users with roles and reputation |
| `Company` | Parent companies (e.g., Coca-Cola Company) |
| `Brand` | Brands owned by companies (e.g., Fanta, Sprite) |
| `Product` | Individual products with barcodes |
| `Category` | Product categories |
| `Claim` | Claims/evidence against companies |
| `Alternative` | Alternative product recommendations |
| `Store` | Physical stores with locations |
| `Submission` | User-submitted content for review |

### Verdict Labels

| Label | Description | Color |
|-------|-------------|-------|
| `AVOID` | Boycotted product/company | 🔴 Red |
| `CAUTION` | Use with caution | 🟡 Yellow |
| `PREFERRED` | Recommended alternative | 🟢 Green |
| `UNKNOWN` | Not yet verified | ⚪ Gray |

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login
GET    /api/auth/me          # Get current user
PATCH  /api/auth/me          # Update profile
```

### Products
```
GET    /api/products                    # List products
GET    /api/products/:id                # Get product by ID
GET    /api/products/barcode/:barcode   # Get product by barcode
GET    /api/products/trending           # Get trending products
GET    /api/products/stats              # Get global statistics
GET    /api/products/:id/alternatives   # Get alternatives
GET    /api/products/:id/claims         # Get claims
POST   /api/products/:id/scan           # Record scan
```

### Companies
```
GET    /api/companies              # List companies
GET    /api/companies/:id          # Get company details
GET    /api/companies/:id/brands   # Get company brands
GET    /api/companies/:id/products # Get company products
```

### Alternatives
```
GET    /api/alternatives/product/:id    # Get by product
GET    /api/alternatives/category/:id   # Get by category
GET    /api/alternatives/top            # Get top alternatives
GET    /api/alternatives/recent         # Get recent alternatives
```

### Search
```
GET    /api/search                 # Search all (products, companies, brands)
GET    /api/search/products        # Search products
GET    /api/search/companies       # Search companies
GET    /api/search/categories      # Get categories
```

### Submissions
```
GET    /api/submissions            # List submissions
POST   /api/submissions            # Create submission
GET    /api/submissions/:id        # Get submission
POST   /api/submissions/:id/vote   # Vote on submission
```

### Users
```
GET    /api/users/leaderboard      # Get leaderboard
GET    /api/users/:id              # Get user profile
GET    /api/users/:id/stats        # Get user stats
GET    /api/users/:id/badges       # Get user badges
```

---

## 🌐 Supported Languages

- 🇸🇦 Arabic (العربية) - Primary
- 🇬🇧 English - Secondary

The app is RTL-first, designed for Arabic-speaking users.

---

## 🤝 Contributing

### Adding New Products

1. Click "ساهم" (Contribute) from the menu
2. Select "منتج جديد" (New Product)
3. Fill in product details:
   - Name (Arabic & English)
   - Barcode
   - Brand
   - Category
   - Verdict
4. Add evidence sources
5. Submit for review

### Adding Alternatives

1. Navigate to a boycotted product
2. Click "أضف بديلاً" (Add Alternative)
3. Enter alternative product details
4. Submit for review

### Reporting Issues

Please report bugs and feature requests through the issue tracker.

---

## 📱 Screenshots

### Home Page
- Quick search bar
- Statistics dashboard
- Trending products
- Recent alternatives

### Product Page
- Product verdict (AVOID/CAUTION/PREFERRED)
- Company ownership chain
- Claims and evidence
- Available alternatives with store locations

### Discover Page
- Browse by category
- Filter local products
- Find where to buy alternatives

### Community Page
- Leaderboard
- Recent contributions
- Submit new content

---

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with Zod
- CORS protection
- Rate limiting (recommended for production)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- The Libyan community for their support
- Open source contributors
- All users who contribute to the database

---

<div align="center">

**Made with ❤️ for conscious consumers**

[Report Bug](../../issues) · [Request Feature](../../issues)

</div>
