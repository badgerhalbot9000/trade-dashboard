/**
 * Technical Indicators Calculator
 * Calculate various technical indicators from price data
 */

export interface PriceData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

/**
 * Simple Moving Average (SMA)
 */
export function calculateSMA(prices: number[], period: number): number[] {
  if (prices.length < period) return []
  
  const sma: number[] = []
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
    sma.push(sum / period)
  }
  return sma
}

/**
 * Exponential Moving Average (EMA)
 */
export function calculateEMA(prices: number[], period: number): number[] {
  if (prices.length < period) return []
  
  const k = 2 / (period + 1)
  const ema: number[] = []
  
  // Start with SMA for first value
  const firstSMA = prices.slice(0, period).reduce((a, b) => a + b, 0) / period
  ema.push(firstSMA)
  
  // Calculate EMA for remaining values
  for (let i = period; i < prices.length; i++) {
    const value = prices[i] * k + ema[ema.length - 1] * (1 - k)
    ema.push(value)
  }
  
  return ema
}

/**
 * Relative Strength Index (RSI)
 */
export function calculateRSI(prices: number[], period: number = 14): number[] {
  if (prices.length < period + 1) return []
  
  const rsi: number[] = []
  const gains: number[] = []
  const losses: number[] = []
  
  // Calculate price changes
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1]
    gains.push(change > 0 ? change : 0)
    losses.push(change < 0 ? Math.abs(change) : 0)
  }
  
  // Calculate initial average gain and loss
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period
  
  // Calculate RSI for each period
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period
    
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
    const rsiValue = 100 - (100 / (1 + rs))
    rsi.push(rsiValue)
  }
  
  return rsi
}

/**
 * Moving Average Convergence Divergence (MACD)
 */
export function calculateMACD(prices: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
  const emaFast = calculateEMA(prices, fastPeriod)
  const emaSlow = calculateEMA(prices, slowPeriod)
  
  // Calculate MACD line
  const macdLine: number[] = []
  const offset = slowPeriod - fastPeriod
  for (let i = 0; i < emaSlow.length; i++) {
    macdLine.push(emaFast[i + offset] - emaSlow[i])
  }
  
  // Calculate signal line
  const signalLine = calculateEMA(macdLine, signalPeriod)
  
  // Calculate histogram
  const histogram: number[] = []
  const histOffset = signalPeriod - 1
  for (let i = 0; i < signalLine.length; i++) {
    histogram.push(macdLine[i + histOffset] - signalLine[i])
  }
  
  return {
    macd: macdLine,
    signal: signalLine,
    histogram
  }
}

/**
 * Bollinger Bands
 */
export function calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2) {
  const sma = calculateSMA(prices, period)
  const upperBand: number[] = []
  const lowerBand: number[] = []
  
  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1)
    const mean = slice.reduce((a, b) => a + b, 0) / period
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period
    const sd = Math.sqrt(variance)
    
    upperBand.push(sma[i - period + 1] + (stdDev * sd))
    lowerBand.push(sma[i - period + 1] - (stdDev * sd))
  }
  
  return {
    middle: sma,
    upper: upperBand,
    lower: lowerBand
  }
}

/**
 * Average True Range (ATR)
 */
export function calculateATR(data: PriceData[], period: number = 14): number[] {
  if (data.length < period + 1) return []
  
  const trueRanges: number[] = []
  
  for (let i = 1; i < data.length; i++) {
    const high = data[i].high
    const low = data[i].low
    const prevClose = data[i - 1].close
    
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    )
    trueRanges.push(tr)
  }
  
  return calculateEMA(trueRanges, period)
}

/**
 * Stochastic Oscillator
 */
export function calculateStochastic(data: PriceData[], period: number = 14) {
  const kValues: number[] = []
  
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1)
    const high = Math.max(...slice.map(d => d.high))
    const low = Math.min(...slice.map(d => d.low))
    const close = data[i].close
    
    const k = ((close - low) / (high - low)) * 100
    kValues.push(k)
  }
  
  // %D is 3-period SMA of %K
  const dValues = calculateSMA(kValues, 3)
  
  return {
    k: kValues,
    d: dValues
  }
}

/**
 * Get current indicator values (latest)
 */
export function getCurrentIndicators(prices: number[]) {
  if (prices.length < 50) {
    return null
  }
  
  const sma20 = calculateSMA(prices, 20)
  const sma50 = calculateSMA(prices, 50)
  const ema12 = calculateEMA(prices, 12)
  const ema26 = calculateEMA(prices, 26)
  const rsi = calculateRSI(prices, 14)
  const macd = calculateMACD(prices, 12, 26, 9)
  
  return {
    currentPrice: prices[prices.length - 1],
    sma20: sma20[sma20.length - 1],
    sma50: sma50[sma50.length - 1],
    ema12: ema12[ema12.length - 1],
    ema26: ema26[ema26.length - 1],
    rsi: rsi[rsi.length - 1],
    macd: macd.macd[macd.macd.length - 1],
    macdSignal: macd.signal[macd.signal.length - 1],
    macdHistogram: macd.histogram[macd.histogram.length - 1]
  }
}
