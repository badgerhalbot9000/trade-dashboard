# Trade Dashboard - Live Data Integration Plan

**Date:** 2026-02-01  
**Repo:** https://github.com/badgerhalbot9000/trade-dashboard  
**Status:** In progress

---

## Current State

**What We Have:**
- Next.js 16 fintech dashboard starter (Mosaic template)
- 14 dashboard cards with mock data:
  - Portfolio returns (line chart)
  - Credit card display
  - Cash flow (bar chart)
  - Recent expenses/earnings tables
  - Saving goals (line chart)
  - Growth portfolio (line chart)
  - Portfolio value (pie chart)
  - Stock graphs (multiple line charts)
  - Market trends table
- Chart.js for visualizations
- Tailwind CSS for styling
- TypeScript
- Dark mode support

**What Needs Work:**
- All data is currently static/mock
- No API integrations
- Dependencies need updating
- No real-time data feeds

---

## Phase 1: Update Dependencies ✅ IN PROGRESS

### Current Dependencies
```json
"dependencies": {
  "next": "16.0.10",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "chart.js": "^4.4.7",
  "typescript": "^5.7.3"
}
```

### Updates Needed
- ✅ Next.js: 16.0.10 → 16.1.6 (latest)
- ✅ React: 19.2.3 → 19.2.4 (latest)
- ✅ TypeScript: 5.7.3 → 5.9.3 (latest)
- ✅ Chart.js: 4.4.7 → 4.5.1 (latest)
- ✅ All other packages to latest

### Command
```bash
cd ~/clawd/trade-dashboard
npm update
npm audit fix
```

---

## Phase 2: API Integration - Stock Market Data

### Recommended API: **Alpaca** (Free Paper Trading)

**Why Alpaca:**
- ✅ Free paper trading account
- ✅ Real-time stock data
- ✅ Historical data (6+ years)
- ✅ Easy API (REST + WebSockets)
- ✅ No credit card required
- ✅ Used by thousands of algo traders

**Alternative APIs:**
- **Alpha Vantage:** Real-time & historical, free tier (5 calls/min)
- **Finnhub:** Real-time data, free tier
- **Twelve Data:** Multi-asset data, free tier

### Implementation Plan

**Step 1: Sign Up for Alpaca**
1. Go to https://alpaca.markets/
2. Create account (paper trading - free)
3. Get API keys (Key ID + Secret Key)
4. Store in `.env.local`:
   ```
   ALPACA_API_KEY=your-key-here
   ALPACA_API_SECRET=your-secret-here
   ALPACA_PAPER=true
   ```

**Step 2: Install Alpaca SDK**
```bash
npm install @alpacahq/alpaca-trade-api
```

**Step 3: Create API Route for Stock Data**

Create `app/api/stocks/route.ts`:
```typescript
import { AlpacaClient } from '@alpacahq/alpaca-trade-api'

const alpaca = new AlpacaClient({
  keyId: process.env.ALPACA_API_KEY!,
  secretKey: process.env.ALPACA_API_SECRET!,
  paper: process.env.ALPACA_PAPER === 'true',
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol') || 'AAPL'
  
  try {
    // Get latest quote
    const quote = await alpaca.getLatestQuote(symbol)
    
    // Get daily bars (last 30 days)
    const bars = await alpaca.getBars(symbol, {
      timeframe: '1Day',
      limit: 30
    })
    
    return Response.json({
      symbol,
      currentPrice: quote.ap, // ask price
      change: quote.ap - bars[0].c, // current vs first close
      changePercent: ((quote.ap - bars[0].c) / bars[0].c) * 100,
      history: bars.map(bar => ({
        date: bar.t,
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v
      }))
    })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch stock data' }, { status: 500 })
  }
}
```

**Step 4: Create React Hook for Data Fetching**

Create `lib/hooks/use-stock-data.ts`:
```typescript
import { useState, useEffect } from 'react'

export interface StockData {
  symbol: string
  currentPrice: number
  change: number
  changePercent: number
  history: Array<{
    date: string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }>
}

export function useStockData(symbol: string, refreshInterval = 60000) {
  const [data, setData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/stocks?symbol=${symbol}`)
        if (!response.ok) throw new Error('Failed to fetch')
        const json = await response.json()
        setData(json)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [symbol, refreshInterval])

  return { data, loading, error }
}
```

**Step 5: Update Dashboard Cards with Live Data**

Example for `fintech-card-10.tsx` (stock graph):
```typescript
'use client'

import { useStockData } from '@/lib/hooks/use-stock-data'
import { Line } from 'react-chartjs-2'

export default function FintechCard10() {
  const { data, loading, error } = useStockData('AAPL')

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!data) return null

  const chartData = {
    labels: data.history.map(h => new Date(h.date).toLocaleDateString()),
    datasets: [{
      label: data.symbol,
      data: data.history.map(h => h.close),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }

  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          {data.symbol} - ${data.currentPrice.toFixed(2)}
        </h2>
        <div className={data.change >= 0 ? 'text-green-500' : 'text-red-500'}>
          {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} 
          ({data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%)
        </div>
      </header>
      <div className="p-5">
        <Line data={chartData} />
      </div>
    </div>
  )
}
```

---

## Phase 3: Real-Time Updates with WebSockets

**Alpaca WebSocket Integration:**

Create `lib/alpaca-ws.ts`:
```typescript
import { AlpacaStream } from '@alpacahq/alpaca-trade-api'

export function createStockStream(symbols: string[], onUpdate: (data: any) => void) {
  const stream = new AlpacaStream({
    keyId: process.env.NEXT_PUBLIC_ALPACA_API_KEY!,
    secretKey: process.env.NEXT_PUBLIC_ALPACA_API_SECRET!,
    paper: true,
  })

  stream.onConnect(() => {
    stream.subscribeForQuotes(symbols)
  })

  stream.onStateChange((state) => {
    console.log('Stream state:', state)
  })

  stream.onStockQuote((quote) => {
    onUpdate(quote)
  })

  stream.connect()

  return () => stream.disconnect()
}
```

**Use in dashboard:**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { createStockStream } from '@/lib/alpaca-ws'

export default function LiveStockCard() {
  const [quotes, setQuotes] = useState<Record<string, any>>({})

  useEffect(() => {
    const disconnect = createStockStream(['AAPL', 'GOOGL', 'MSFT'], (quote) => {
      setQuotes(prev => ({
        ...prev,
        [quote.Symbol]: quote
      }))
    })

    return disconnect
  }, [])

  // Render live quotes
}
```

---

## Phase 4: Additional Data Sources

### Portfolio Data
**Source:** Alpaca Account API
- Current positions
- Portfolio value
- Buying power
- P&L

**API Route:** `app/api/portfolio/route.ts`
```typescript
export async function GET() {
  const account = await alpaca.getAccount()
  const positions = await alpaca.getPositions()
  
  return Response.json({
    balance: parseFloat(account.cash),
    portfolioValue: parseFloat(account.portfolio_value),
    buyingPower: parseFloat(account.buying_power),
    positions: positions.map(p => ({
      symbol: p.symbol,
      qty: p.qty,
      avgEntryPrice: p.avg_entry_price,
      currentPrice: p.current_price,
      marketValue: p.market_value,
      unrealizedPL: p.unrealized_pl
    }))
  })
}
```

### Market News
**Source:** Alpaca News API (or Finnhub)
```typescript
export async function GET() {
  const news = await alpaca.getNews({
    limit: 10
  })
  
  return Response.json(news)
}
```

### Market Movers
**Source:** Alpaca Screener API
```typescript
export async function GET() {
  const gainers = await alpaca.getSnapshots('gainers')
  const losers = await alpaca.getSnapshots('losers')
  
  return Response.json({ gainers, losers })
}
```

---

## Phase 5: Dashboard Enhancements

### Add New Cards

**1. Real-Time Ticker**
- Scrolling ticker with live prices
- Top gainers/losers
- Market indices (SPY, QQQ, DIA)

**2. Portfolio Summary**
- Total value
- Daily P&L
- Top positions
- Asset allocation pie chart

**3. Recent Trades**
- Table of recent orders
- Status (filled, pending, cancelled)
- Timestamps

**4. Market News Feed**
- Latest news
- Clickable headlines
- Source attribution

**5. Watchlist**
- User-customizable
- Add/remove symbols
- Quick view of prices

---

## Phase 6: Deployment

### Vercel Deployment

**Steps:**
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables:
   ```
   ALPACA_API_KEY=xxx
   ALPACA_API_SECRET=xxx
   ALPACA_PAPER=true
   ```
4. Deploy

**URL:** `https://trade-dashboard-badgerhalbot9000.vercel.app`

---

## Security Considerations

### API Keys
- ✅ Never commit API keys to git
- ✅ Use `.env.local` (git-ignored)
- ✅ Use Vercel environment variables in production
- ✅ Use paper trading keys (not live trading)

### Rate Limiting
- ✅ Implement API route caching
- ✅ Respect API rate limits
- ✅ Add loading states
- ✅ Handle errors gracefully

### CORS
- ✅ API routes run server-side (no CORS issues)
- ✅ WebSocket connections from client (allowed by Alpaca)

---

## Alternative: Cryptocurrency Data

**If you want crypto instead/in addition:**

**API:** CoinGecko or CoinMarketCap

**Install:**
```bash
npm install coingecko-api
```

**API Route:** `app/api/crypto/route.ts`
```typescript
import CoinGecko from 'coingecko-api'

const CoinGeckoClient = new CoinGecko()

export async function GET() {
  const data = await CoinGeckoClient.coins.markets({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 10,
    page: 1
  })
  
  return Response.json(data.data)
}
```

---

## Timeline

### Week 1
- ✅ Update dependencies
- ✅ Add collaborator (badger3000)
- ✅ Set up Alpaca account
- ✅ Create API routes for stock data
- ✅ Update 2-3 cards with live data

### Week 2
- Add WebSocket support for real-time updates
- Update remaining dashboard cards
- Add portfolio integration
- Add news feed

### Week 3
- Add watchlist functionality
- Polish UI/UX
- Add error handling
- Performance optimization

### Week 4
- Deploy to Vercel
- Testing
- Documentation
- Demo preparation

---

## Cost Summary

**All Free Tier:**
- Alpaca Paper Trading: FREE ✅
- Vercel Hosting: FREE (hobby plan) ✅
- GitHub: FREE ✅
- Next.js: FREE ✅

**Optional Paid (if scaling):**
- Alpaca Live Trading: $0/month (commission-free)
- Alpha Vantage Premium: $50-150/month
- Vercel Pro: $20/month

---

## Next Steps

1. ✅ **Update dependencies** (in progress)
2. **Sign up for Alpaca:** https://alpaca.markets/
3. **Create API routes** for stock data
4. **Update first card** with live data
5. **Test and iterate**

---

## Questions to Answer

1. **Which symbols to track?** (AAPL, GOOGL, MSFT, TSLA, etc.)
2. **Update frequency?** (60s, 5min, real-time WebSocket?)
3. **Include crypto?** (Yes/No)
4. **Portfolio tracking?** (Just display or also execute trades?)
5. **Target deployment?** (Vercel, Railway, self-hosted?)

---

**Status:** Ready to implement Phase 1 (dependencies) and Phase 2 (Alpaca integration)

**Repo:** https://github.com/badgerhalbot9000/trade-dashboard  
**Collaborators:** badgerhalbot9000 (owner), badger3000 (admin)  
**Last Updated:** 2026-02-01
