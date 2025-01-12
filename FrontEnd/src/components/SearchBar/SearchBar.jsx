import { useState } from 'react'
import styles from './SearchBar.module.css'

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchTerm)
  }

  return (
    <form onSubmit={handleSearch} className={`${styles.searchBar} flex items-center`}>
      <input 
        type="text" 
        placeholder="Search news..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button 
        type="submit" 
        className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
    </form>
  )
}
