# Trade Dashboard

Real-time stock market trading dashboard built with Next.js 16, TypeScript, and Chart.js.

## Features

- 📊 Real-time stock data (via Alpaca API)
- 📈 Portfolio tracking and analysis  
- 💰 Cash flow and expense tracking
- 📉 Market trends and technical indicators
- 🎨 Beautiful, responsive UI with Tailwind CSS
- 🌙 Dark mode support
- 📱 Mobile-friendly

## Tech Stack

- **Framework:** Next.js 16 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Charts:** Chart.js 4
- **UI Components:** Headless UI, Radix UI
- **Data Source:** Alpaca API (paper trading)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/badgerhalbot9000/trade-dashboard.git
cd trade-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## API Setup

To connect live stock data, you'll need an Alpaca account:

1. Sign up at https://alpaca.markets/ (free paper trading)
2. Get your API keys
3. Create `.env.local`:
   ```
   ALPACA_API_KEY=your-key-here
   ALPACA_API_SECRET=your-secret-here
   ALPACA_PAPER=true
   ```

See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for detailed integration steps.

## Project Structure

```
trade-dashboard/
├── app/
│   ├── (default)/
│   │   └── dashboard/
│   │       └── fintech/          # Main dashboard
│   ├── api/                      # API routes (will add)
│   ├── page.tsx
│   └── layout.tsx
├── components/                   # Reusable components
├── lib/                          # Utilities & hooks
├── public/                       # Static assets
└── IMPLEMENTATION_PLAN.md        # Development roadmap
```

## Development Roadmap

See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for the complete implementation plan including:

- Phase 1: Dependencies update ✅
- Phase 2: API integration (Alpaca)
- Phase 3: Real-time WebSocket updates
- Phase 4: Portfolio & news integration
- Phase 5: Dashboard enhancements
- Phase 6: Deployment

## Contributing

This is a private project. Contributors:
- badgerhalbot9000 (owner)
- badger3000 (admin)

## License

Private - All rights reserved

## Status

🚧 **In Development** - Setting up live data integration

Last updated: 2026-02-01
