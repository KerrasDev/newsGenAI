import { useState, useEffect } from 'react'
import { fetchNews } from '../utils/api'

export default function useNews(category = '', query = '') {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true)
        const articles = await fetchNews(category, query)
        setNews(articles)
        setError(null)
      } catch (err) {
        setError(err)
        setNews([])
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [category, query])

  return { news, loading, error }
}
