'use client'

import { useWatchlist } from '@/lib/hooks/use-watchlist'
import { useState } from 'react'

export default function WatchlistPanel() {
  const { watchlist, addSymbol, removeSymbol, isLoaded } = useWatchlist()
  const [newSymbol, setNewSymbol] = useState('')
  const [error, setError] = useState('')

  const handleAdd = () => {
    if (!newSymbol.trim()) {
      setError('Please enter a symbol')
      return
    }

    const success = addSymbol(newSymbol.trim())
    if (success) {
      setNewSymbol('')
      setError('')
    } else {
      setError('Symbol already in watchlist')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  if (!isLoaded) {
    return (
      <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
        <div className="p-5">
          <div className="text-gray-500">Loading watchlist...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Watchlist ({watchlist.length})
        </h2>
      </header>
      <div className="p-5">
        {/* Add symbol */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add symbol (e.g., AAPL)"
              value={newSymbol}
              onChange={(e) => {
                setNewSymbol(e.target.value.toUpperCase())
                setError('')
              }}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Add
            </button>
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </div>

        {/* List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {watchlist.map(item => (
            <div 
              key={item.symbol} 
              className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-gray-100 dark:border-gray-700"
            >
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">
                  {item.symbol}
                </div>
                <div className="text-xs text-gray-500">
                  {item.name}
                </div>
              </div>
              <button
                onClick={() => removeSymbol(item.symbol)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded p-2 transition-colors"
                title="Remove from watchlist"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {watchlist.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <p className="font-medium">No symbols in watchlist</p>
              <p className="text-sm mt-1">Add your first symbol to start tracking</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
