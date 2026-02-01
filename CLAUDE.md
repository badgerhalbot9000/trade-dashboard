# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/claude-code) when working with this repository.

## Project Overview

Trade Dashboard is a real-time stock market trading dashboard built with Next.js 16, TypeScript, and Chart.js. Based on the Mosaic template, it features live crypto prices (via CoinGecko), portfolio tracking, technical indicators, and a comprehensive component library.

**Status:** Production ready (TypeScript builds with 0 errors, 68+ pages)

## Implemented Features

- **Live Crypto Prices** - Bitcoin, Ethereum, Cardano, Solana, Ripple via CoinGecko (60s refresh)
- **Watchlist** - Add/remove symbols, localStorage persistence
- **Export Features** - CSV, JSON, and PDF/Print export
- **Enhanced Tables** - Sortable columns, real-time search/filter
- **Technical Indicators** - SMA, EMA, RSI, MACD, Bollinger Bands, ATR, Stochastic
- **Portfolio Summary** - Total balance, P&L, top holdings, allocation breakdown
- **Mock Data Generators** - OHLCV data, positions, transactions for testing

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router) with Turbopack
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Charts:** Chart.js 4
- **UI Components:** Headless UI, Radix UI
- **HTTP Client:** Axios
- **Data Source:** CoinGecko API (free, no key required), Alpaca API planned

## Common Commands

```bash
npm run dev      # Start dev server with Turbopack (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
app/
├── (default)/dashboard/fintech/  # Main trading dashboard
├── (alternative)/                # Alternative layouts, component library
├── (auth)/                       # Authentication pages
└── api/crypto/                   # CoinGecko API route

components/
├── charts/                       # Chart.js components (15+ files)
├── ui/                           # Core UI (header, sidebar, logo)
├── utils/                        # Custom hooks and utilities
├── crypto-card.tsx               # Live crypto prices
├── watchlist-panel.tsx           # Symbol watchlist
├── export-menu.tsx               # Export dropdown (CSV, JSON, PDF)
├── enhanced-table.tsx            # Sortable/searchable tables
├── technical-indicators-card.tsx # Technical analysis display
└── portfolio-summary-card.tsx    # Portfolio overview

lib/
├── technical-indicators.ts       # SMA, EMA, RSI, MACD, Bollinger calculations
├── mock-data.ts                  # Test data generators
├── utils.ts                      # General utilities
└── hooks/
    └── use-watchlist.ts          # Watchlist state management (localStorage)
```

## Key Patterns

### Path Aliases
Use `@/` for imports from root: `import { cn } from '@/components/utils/utils'`

### Chart Components
All chart components are in `components/charts/`. They use Chart.js with null-safe tooltip callbacks. When modifying charts, ensure `formatValue()` and `formatThousands()` calls use null coalescing (`??`).

### API Routes
API routes are in `app/api/`. The crypto route (`app/api/crypto/route.ts`) fetches from CoinGecko with 60-second client-side polling.

### State Management
- Watchlist uses localStorage via `lib/hooks/use-watchlist.ts`
- No global state library; React context used where needed

## Environment Variables

For Alpaca API integration (optional):
```
ALPACA_API_KEY=your-key-here
ALPACA_API_SECRET=your-secret-here
ALPACA_PAPER=true
```

## Development Notes

- TypeScript strict mode is enabled
- Dark mode is supported via `next-themes`
- The project uses the App Router (not Pages Router)
- Chart.js tooltips require null-safe value formatting
- Mock data generators are available in `lib/mock-data.ts` for testing

## Build Verification

Run `npm run build` to verify TypeScript compilation. The build should complete with 0 errors and generate 68+ static pages.

## Implementation Roadmap

See `IMPLEMENTATION_PLAN.md` for full details. Current status:

- **Phase 1: Dependencies** ✅ Complete - Next.js 16.1.6, React 19, TypeScript 5
- **Phase 2: API Integration** 🚧 In Progress - Alpaca API for real stock data
- **Phase 3: Real-Time Updates** Planned - WebSocket integration
- **Phase 4: Additional Data** Planned - Portfolio API, news feed, market movers
- **Phase 5: Dashboard Enhancements** Planned - Ticker, recent trades, expanded watchlist
- **Phase 6: Deployment** Planned - Vercel deployment

## Related Documentation

- `FEATURES.md` - Detailed feature descriptions and file locations
- `IMPLEMENTATION_PLAN.md` - Full roadmap with code examples for Alpaca integration
- `README.md` - Getting started and project overview
