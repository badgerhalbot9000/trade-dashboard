'use client'

import { useState } from 'react'

interface ExportMenuProps {
  data?: any[]
  filename?: string
}

export default function ExportMenu({ data, filename = 'portfolio-data' }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const exportCSV = () => {
    // Default portfolio data if none provided
    const defaultData = [
      ['Symbol', 'Price', 'Change %', 'Volume', 'Market Cap'],
      ['AAPL', '150.00', '+2.5', '50000000', '2.5T'],
      ['GOOGL', '2800.00', '+1.8', '25000000', '1.8T'],
      ['MSFT', '380.00', '-0.3', '30000000', '2.8T'],
      ['TSLA', '245.00', '+5.2', '120000000', '780B'],
      ['AMZN', '145.00', '+1.1', '45000000', '1.5T'],
    ]

    const csvData = data || defaultData
    const csv = csvData.map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
    setIsOpen(false)
  }

  const exportJSON = () => {
    const defaultData = {
      exported_at: new Date().toISOString(),
      portfolio: [
        { symbol: 'AAPL', price: 150.00, change: 2.5, volume: 50000000 },
        { symbol: 'GOOGL', price: 2800.00, change: 1.8, volume: 25000000 },
        { symbol: 'MSFT', price: 380.00, change: -0.3, volume: 30000000 },
        { symbol: 'TSLA', price: 245.00, change: 5.2, volume: 120000000 },
        { symbol: 'AMZN', price: 145.00, change: 1.1, volume: 45000000 },
      ]
    }

    const jsonData = JSON.stringify(data || defaultData, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    window.URL.revokeObjectURL(url)
    setIsOpen(false)
  }

  const printPDF = () => {
    window.print()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-gray-100"
      >
        <svg className="fill-current shrink-0" width="16" height="16" viewBox="0 0 16 16">
          <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
        </svg>
        <span className="ml-2">Export</span>
        <svg className={`fill-current shrink-0 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} width="11" height="7" viewBox="0 0 11 7">
          <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-lg shadow-lg z-20">
            <button
              onClick={exportCSV}
              className="block w-full px-4 py-3 text-left text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export as CSV
              </div>
            </button>
            <button
              onClick={exportJSON}
              className="block w-full px-4 py-3 text-left text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Export as JSON
              </div>
            </button>
            <button
              onClick={printPDF}
              className="block w-full px-4 py-3 text-left text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-200 dark:border-gray-700/60"
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print / Save PDF
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
