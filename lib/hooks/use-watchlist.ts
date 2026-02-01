import { useState, useEffect } from 'react'

export interface WatchlistItem {
  symbol: string
  name: string
  addedAt: string
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('watchlist')
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved))
      } catch (err) {
        console.error('Error loading watchlist:', err)
        setWatchlist([])
      }
    }
    setIsLoaded(true)
  }, [])

  const addSymbol = (symbol: string, name?: string) => {
    const normalizedSymbol = symbol.toUpperCase()
    
    // Check if already in watchlist
    if (watchlist.some(item => item.symbol === normalizedSymbol)) {
      return false
    }

    const newList: WatchlistItem[] = [
      ...watchlist,
      { 
        symbol: normalizedSymbol, 
        name: name || normalizedSymbol,
        addedAt: new Date().toISOString()
      }
    ]
    setWatchlist(newList)
    localStorage.setItem('watchlist', JSON.stringify(newList))
    return true
  }

  const removeSymbol = (symbol: string) => {
    const newList = watchlist.filter(item => item.symbol !== symbol.toUpperCase())
    setWatchlist(newList)
    localStorage.setItem('watchlist', JSON.stringify(newList))
  }

  const clearWatchlist = () => {
    setWatchlist([])
    localStorage.removeItem('watchlist')
  }

  return { 
    watchlist, 
    addSymbol, 
    removeSymbol, 
    clearWatchlist,
    isLoaded 
  }
}
