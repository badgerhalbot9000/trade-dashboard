'use client'

import { useState, useEffect } from 'react'
import { generateMockPortfolio } from '@/lib/mock-data'

export default function PortfolioSummaryCard() {
  const [portfolio, setPortfolio] = useState<any>(null)

  useEffect(() => {
    const positions = generateMockPortfolio()
    const totalValue = positions.reduce((sum, p) => sum + p.marketValue, 0)
    const totalCost = positions.reduce((sum, p) => sum + p.totalCost, 0)
    const totalPL = totalValue - totalCost
    const totalPLPercent = ((totalValue - totalCost) / totalCost) * 100

    const dayChange = positions.reduce((sum, p) => {
      const dayPL = p.marketValue * (p.change / 100)
      return sum + dayPL
    }, 0)
    const dayChangePercent = (dayChange / totalValue) * 100

    setPortfolio({
      positions,
      totalValue,
      totalCost,
      totalPL,
      totalPLPercent,
      dayChange,
      dayChangePercent,
      cash: 45230.50 // Mock cash balance
    })
  }, [])

  if (!portfolio) {
    return (
      <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
        <div className="p-5">Loading portfolio...</div>
      </div>
    )
  }

  const totalBalance = portfolio.totalValue + portfolio.cash

  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Portfolio Summary
        </h2>
      </header>
      <div className="p-5">
        {/* Total Balance */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-1">Total Balance</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm font-medium mt-1 ${portfolio.totalPL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {portfolio.totalPL >= 0 ? '+' : ''}${Math.abs(portfolio.totalPL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            {' '}({portfolio.totalPL >= 0 ? '+' : ''}{portfolio.totalPLPercent.toFixed(2)}%) All Time
          </div>
        </div>

        {/* Day Change */}
        <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-700/60">
          <div className="text-sm text-gray-500 mb-1">Today's Change</div>
          <div className={`text-xl font-bold ${portfolio.dayChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {portfolio.dayChange >= 0 ? '+' : ''}${Math.abs(portfolio.dayChange).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm font-medium ${portfolio.dayChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {portfolio.dayChange >= 0 ? '+' : ''}{portfolio.dayChangePercent.toFixed(2)}%
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Portfolio Value</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              ${portfolio.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Cash</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              ${portfolio.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Cost</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              ${portfolio.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700/60">
            <span className="text-sm text-gray-600 dark:text-gray-400">Positions</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {portfolio.positions.length}
            </span>
          </div>
        </div>

        {/* Top Positions */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/60">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Top Holdings
          </div>
          <div className="space-y-3">
            {portfolio.positions.slice(0, 3).map((position: any) => {
              const allocation = (position.marketValue / portfolio.totalValue) * 100
              return (
                <div key={position.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {position.symbol}
                    </span>
                    <span className="text-xs text-gray-500">
                      {allocation.toFixed(1)}%
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${position.unrealizedPLPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {position.unrealizedPLPercent >= 0 ? '+' : ''}{position.unrealizedPLPercent.toFixed(2)}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
