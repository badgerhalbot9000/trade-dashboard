import { PriceData } from './technical-indicators'

/**
 * Generate realistic mock stock data
 */
export function generateMockStockData(
  symbol: string,
  days: number = 90,
  basePrice: number = 100
): PriceData[] {
  const data: PriceData[] = []
  let currentPrice = basePrice
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Simulate realistic price movement
    const volatility = 0.02 // 2% daily volatility
    const trend = 0.0005 // Slight upward trend
    const randomWalk = (Math.random() - 0.5) * volatility
    
    // Calculate OHLC
    const priceChange = currentPrice * (trend + randomWalk)
    currentPrice += priceChange
    
    const open = currentPrice + (Math.random() - 0.5) * currentPrice * 0.01
    const close = currentPrice + (Math.random() - 0.5) * currentPrice * 0.01
    const high = Math.max(open, close) + Math.random() * currentPrice * 0.015
    const low = Math.min(open, close) - Math.random() * currentPrice * 0.015
    const volume = Math.floor((Math.random() * 5000000 + 1000000) * (1 + Math.abs(priceChange / currentPrice) * 10))
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Math.max(0.01, open),
      high: Math.max(0.01, high),
      low: Math.max(0.01, low),
      close: Math.max(0.01, close),
      volume
    })
  }
  
  return data
}

/**
 * Get common stock symbols with company names
 */
export const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 150 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', basePrice: 2800 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', basePrice: 380 },
  { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 245 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 145 },
  { symbol: 'META', name: 'Meta Platforms Inc.', basePrice: 425 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', basePrice: 820 },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', basePrice: 162 },
  { symbol: 'V', name: 'Visa Inc.', basePrice: 275 },
  { symbol: 'WMT', name: 'Walmart Inc.', basePrice: 165 },
  { symbol: 'DIS', name: 'The Walt Disney Company', basePrice: 95 },
  { symbol: 'NFLX', name: 'Netflix Inc.', basePrice: 485 },
  { symbol: 'BA', name: 'Boeing Company', basePrice: 220 },
  { symbol: 'COIN', name: 'Coinbase Global Inc.', basePrice: 185 },
  { symbol: 'SQ', name: 'Block Inc.', basePrice: 75 },
]

/**
 * Generate portfolio mock data
 */
export function generateMockPortfolio() {
  return [
    { symbol: 'AAPL', shares: 50, avgCost: 145.20, currentPrice: 150.25, change: 2.5 },
    { symbol: 'GOOGL', shares: 10, avgCost: 2750.00, currentPrice: 2845.50, change: 1.8 },
    { symbol: 'MSFT', shares: 40, avgCost: 375.80, currentPrice: 380.75, change: -0.3 },
    { symbol: 'TSLA', shares: 25, avgCost: 235.00, currentPrice: 245.80, change: 5.2 },
    { symbol: 'NVDA', shares: 15, avgCost: 785.00, currentPrice: 820.50, change: 3.8 },
  ].map(position => ({
    ...position,
    marketValue: position.shares * position.currentPrice,
    totalCost: position.shares * position.avgCost,
    unrealizedPL: (position.currentPrice - position.avgCost) * position.shares,
    unrealizedPLPercent: ((position.currentPrice - position.avgCost) / position.avgCost) * 100
  }))
}

/**
 * Generate mock transactions
 */
export function generateMockTransactions(count: number = 20) {
  const types = ['BUY', 'SELL']
  const transactions = []
  
  for (let i = 0; i < count; i++) {
    const stock = POPULAR_STOCKS[Math.floor(Math.random() * POPULAR_STOCKS.length)]
    const type = types[Math.floor(Math.random() * types.length)]
    const shares = Math.floor(Math.random() * 50) + 1
    const price = stock.basePrice + (Math.random() - 0.5) * 20
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 90))
    
    transactions.push({
      id: `TXN${1000 + i}`,
      date: date.toISOString().split('T')[0],
      type,
      symbol: stock.symbol,
      name: stock.name,
      shares,
      price: parseFloat(price.toFixed(2)),
      total: parseFloat((shares * price).toFixed(2)),
      status: i < 3 ? 'PENDING' : 'COMPLETED'
    })
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Calculate price statistics
 */
export function calculatePriceStats(data: PriceData[]) {
  const closes = data.map(d => d.close)
  const min = Math.min(...closes)
  const max = Math.max(...closes)
  const current = closes[closes.length - 1]
  const first = closes[0]
  const change = current - first
  const changePercent = (change / first) * 100
  
  const volumes = data.map(d => d.volume)
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length
  
  return {
    current,
    min,
    max,
    change,
    changePercent,
    avgVolume,
    high52Week: max,
    low52Week: min
  }
}
