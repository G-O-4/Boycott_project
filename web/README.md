# Boycott Companion Web App

Modern Arabic-first web application for the Boycott Companion platform.

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Routing:** React Router v6
- **Animations:** Framer Motion
- **Barcode Scanning:** html5-qrcode

## Features

- 🔍 **Barcode Scanner** - Scan products using device camera
- 🔄 **Alternatives** - Find replacements for boycotted products
- 🏢 **Company Explorer** - View ownership chains and brand connections
- 👥 **Community** - Submit suggestions and vote on contributions
- 🏆 **Gamification** - Earn points and badges for participation
- 🌐 **Bilingual** - Full Arabic and English support
- 📱 **Responsive** - Works on all devices

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see `../backend/README.md`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Layout.tsx
│   ├── Header.tsx
│   ├── BottomNav.tsx
│   ├── VerdictBadge.tsx
│   └── BarcodeScanner.tsx
├── pages/            # Page components
│   ├── HomePage.tsx
│   ├── ScanResultPage.tsx
│   ├── ProductPage.tsx
│   ├── CompanyPage.tsx
│   ├── DiscoverPage.tsx
│   ├── CategoryPage.tsx
│   ├── CommunityPage.tsx
│   ├── ProfilePage.tsx
│   ├── SearchPage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── store/            # Zustand state stores
│   ├── auth.ts
│   ├── language.ts
│   └── city.ts
├── lib/              # Utilities and API client
│   └── api.ts
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Configuration

The app proxies API requests to `http://localhost:3000` in development. Update `vite.config.ts` to change the backend URL.

## RTL Support

The app is Arabic-first with full RTL (Right-to-Left) support. Language can be toggled between Arabic and English via the header.

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:
- `primary` - Main brand colors (green)
- `avoid` - Red for boycotted items
- `caution` - Amber for caution items
- `preferred` - Green for alternatives
- `palestine` - Palestinian flag colors for accents

### Fonts

The app uses:
- **Noto Kufi Arabic** - For Arabic text
- **Inter** - For English text

## License

ISC

