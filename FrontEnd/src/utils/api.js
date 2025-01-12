const BASE_URL = 'https://newsapi.org/v2'
const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY

export async function fetchNews(category = '', query = '') {
  try {
    const url = new URL(`${BASE_URL}/top-headlines`)
    const params = new URLSearchParams({
      apiKey: API_KEY,
      country: 'us',
      ...(category && { category }),
      ...(query && { q: query })
    })
    url.search = params.toString()

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch news')
    }

    const data = await response.json()
    return data.articles
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}
