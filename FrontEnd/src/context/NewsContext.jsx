import React, { createContext, useState } from 'react'

export const NewsContext = createContext()

export function NewsProvider({ children }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <NewsContext.Provider value={{
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </NewsContext.Provider>
  )
}
