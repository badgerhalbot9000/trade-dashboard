'use client'

import { useState, useEffect } from 'react'
import { generateMockStockData } from '@/lib/mock-data'
import { getCurrentIndicators } from '@/lib/technical-indicators'

export default function TechnicalIndicatorsCard() {
  const [indicators, setIndicators] = useState<any>(null)
  const [symbol, setSymbol] = useState('AAPL')

  useEffect(() => {
    // Generate mock data and calculate indicators
    const data = generateMockStockData(symbol, 90, 150)
    const prices = data.map(d => d.close)
    const calculated = getCurrentIndicators(prices)
    setIndicators(calculated)
  }, [symbol])

  if (!indicators) {
    return (
      <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
        <div className="p-5">Loading indicators...</div>
      </div>
    )
  }

  const getRSIStatus = (rsi: number) => {
    if (rsi > 70) return { text: 'Overbought', color: 'text-red-600 dark:text-red-400' }
    if (rsi < 30) return { text: 'Oversold', color: 'text-green-600 dark:text-green-400' }
    return { text: 'Neutral', color: 'text-gray-600 dark:text-gray-400' }
  }

  const getMACDStatus = (macd: number, signal: number) => {
    if (macd > signal) return { text: 'Bullish', color: 'text-green-600 dark:text-green-400' }
    return { text: 'Bearish', color: 'text-red-600 dark:text-red-400' }
  }

  const getTrendStatus = (price: number, sma20: number, sma50: number) => {
    if (price > sma20 && sma20 > sma50) return { text: 'Strong Uptrend', color: 'text-green-600 dark:text-green-400' }
    if (price < sma20 && sma20 < sma50) return { text: 'Strong Downtrend', color: 'text-red-600 dark:text-red-400' }
    return { text: 'Sideways', color: 'text-gray-600 dark:text-gray-400' }
  }

  const rsiStatus = getRSIStatus(indicators.rsi)
  const macdStatus = getMACDStatus(indicators.macd, indicators.macdSignal)
  const trendStatus = getTrendStatus(indicators.currentPrice, indicators.sma20, indicators.sma50)

  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Technical Indicators
        </h2>
        <div className="text-xs text-gray-500">
          {symbol}
        </div>
      </header>
      <div className="p-5">
        {/* Current Price */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-1">Current Price</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            ${indicators.currentPrice.toFixed(2)}
          </div>
        </div>

        {/* Moving Averages */}
        <div className="mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">SMA 20</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              ${indicators.sma20.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">SMA 50</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              ${indicators.sma50.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700/60">
            <span className="text-sm text-gray-600 dark:text-gray-400">Trend</span>
            <span className={`font-semibold ${trendStatus.color}`}>
              {trendStatus.text}
            </span>
          </div>
        </div>

        {/* RSI */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">RSI (14)</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {indicators.rsi.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700/60">
            <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
            <span className={`font-semibold ${rsiStatus.color}`}>
              {rsiStatus.text}
            </span>
          </div>
          {/* RSI Bar */}
          <div className="relative pt-1">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>0</span>
              <span>30</span>
              <span>70</span>
              <span>100</span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
              <div 
                style={{ width: `${indicators.rsi}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                  indicators.rsi > 70 ? 'bg-red-500' : indicators.rsi < 30 ? 'bg-green-500' : 'bg-blue-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* MACD */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">MACD</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {indicators.macd.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Signal</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {indicators.macdSignal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Histogram</span>
            <span className={`font-semibold ${indicators.macdHistogram >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {indicators.macdHistogram.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Signal</span>
            <span className={`font-semibold ${macdStatus.color}`}>
              {macdStatus.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
