import { useState, useEffect } from 'react';

// Custom Hook
export type Asset = 'BNB' | 'BGL' | 'USDT' | 'ETH'
export const usePriceHistory = (asset: Asset) => {
  const [priceHistory, setPriceHistory] = useState(null);
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);


  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const res = await fetch('https://api.sevaultwallet.com/app/chart-historical')
        const points = await res.json()

        if (res.ok) {
          setPriceHistory(points[asset].datasets)
          setMax(points[asset].datasets.max)
          setMin(points[asset].datasets.min)
        } else {
          setError('Failed to fetch price data')
        }
      } catch (err) {
        setError('Error fetching price data')
      }
    }

    if (asset) {
      fetchPriceData()
    }
  }, [asset])

  return { priceHistory, error, min, max }
}
