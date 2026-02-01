import axios from 'axios'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbols = searchParams.get('symbols') || 'bitcoin,ethereum,cardano,solana,ripple'
  
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: symbols,
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_24hr_vol: true,
        include_market_cap: true
      }
    })
    
    return Response.json(response.data)
  } catch (error) {
    console.error('CoinGecko API error:', error)
    return Response.json({ error: 'Failed to fetch crypto data' }, { status: 500 })
  }
}
