import { useState } from 'react'
import styles from './Sidebar.module.css'
import { CATEGORIES } from '../../constants/categories'

export default function Sidebar() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  return (
    <aside className={`${styles.sidebar} bg-white p-4 rounded-lg shadow-md`}>
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <ul>
        {CATEGORIES.map((category) => (
          <li 
            key={category} 
            className={`
              py-2 px-3 cursor-pointer rounded 
              ${selectedCategory === category ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}
            `}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </li>
        ))}
      </ul>
    </aside>
  )
}
