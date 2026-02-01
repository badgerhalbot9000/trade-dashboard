'use client'

import { useState, useEffect } from 'react'

interface CryptoData {
  usd: number
  usd_24h_change: number
  usd_24h_vol: number
  usd_market_cap: number
}

interface CryptoResponse {
  [key: string]: CryptoData
}

const CRYPTO_NAMES: { [key: string]: string } = {
  bitcoin: 'Bitcoin',
  ethereum: 'Ethereum',
  cardano: 'Cardano',
  solana: 'Solana',
  ripple: 'Ripple (XRP)'
}

export default function CryptoCard() {
  const [data, setData] = useState<CryptoResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/crypto')
        if (!res.ok) throw new Error('Failed to fetch')
        const json = await res.json()
        setData(json)
        setError(null)
      } catch (err) {
        setError('Failed to load crypto data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
        <div className="px-5 py-4">
          <div className="flex items-center justify-center h-48">
            <div className="text-gray-500">Loading crypto prices...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
        <div className="px-5 py-4">
          <div className="flex items-center justify-center h-48">
            <div className="text-red-500">{error || 'No data available'}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Live Crypto Prices
        </h2>
        <div className="text-xs text-gray-500">
          Updates every minute
        </div>
      </header>
      <div className="p-5">
        <div className="space-y-4">
          {Object.entries(data).map(([coin, info]) => (
            <div key={coin} className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-100">
                  {CRYPTO_NAMES[coin] || coin}
                </div>
                <div className="text-xs text-gray-500">
                  Vol: ${(info.usd_24h_vol / 1000000000).toFixed(2)}B
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-800 dark:text-gray-100">
                  ${info.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`text-sm font-medium ${info.usd_24h_change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {info.usd_24h_change >= 0 ? '+' : ''}{info.usd_24h_change?.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
