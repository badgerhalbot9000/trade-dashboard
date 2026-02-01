'use client'

import EnhancedTable, { TableColumn } from './enhanced-table'

// Mock data - replace with real API data later
const marketData = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 150.25, change: 2.5, volume: 52000000, marketCap: '2.5T' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2845.50, change: 1.8, volume: 25000000, marketCap: '1.8T' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 380.75, change: -0.3, volume: 30000000, marketCap: '2.8T' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.80, change: 5.2, volume: 125000000, marketCap: '780B' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.60, change: 1.1, volume: 45000000, marketCap: '1.5T' },
  { symbol: 'META', name: 'Meta Platforms', price: 425.90, change: -1.5, volume: 20000000, marketCap: '1.1T' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 820.50, change: 3.8, volume: 55000000, marketCap: '2.0T' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', price: 385.20, change: 0.5, volume: 3500000, marketCap: '900B' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 162.40, change: 0.9, volume: 12000000, marketCap: '465B' },
  { symbol: 'V', name: 'Visa Inc.', price: 275.30, change: 1.2, volume: 7500000, marketCap: '575B' },
]

const columns: TableColumn[] = [
  {
    key: 'symbol',
    label: 'Symbol',
    sortable: true,
    render: (value) => (
      <span className="font-semibold text-blue-600 dark:text-blue-400">{value}</span>
    )
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'price',
    label: 'Price',
    sortable: true,
    render: (value) => <span className="font-medium">${value.toFixed(2)}</span>
  },
  {
    key: 'change',
    label: 'Change %',
    sortable: true,
    render: (value) => (
      <span className={`font-semibold ${value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {value >= 0 ? '+' : ''}{value.toFixed(2)}%
      </span>
    )
  },
  {
    key: 'volume',
    label: 'Volume',
    sortable: true,
    render: (value) => (value / 1000000).toFixed(2) + 'M'
  },
  {
    key: 'marketCap',
    label: 'Market Cap',
    sortable: true,
  },
]

export default function MarketTrendsCard() {
  return (
    <div className="col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Market Trends
        </h2>
      </header>
      <div className="p-5">
        <EnhancedTable 
          columns={columns} 
          data={marketData}
          searchable={true}
          emptyMessage="No market data available"
        />
      </div>
    </div>
  )
}
