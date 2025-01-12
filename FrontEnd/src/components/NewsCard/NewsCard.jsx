import styles from './NewsCard.module.css'

export default function NewsCard({ title, description, imageUrl, url }) {
  return (
    <div className={`${styles.newsCard} bg-white rounded-lg shadow-md overflow-hidden`}>
      <img 
        src={imageUrl || '/placeholder-image.jpg'} 
        alt={title || 'News Article'} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 truncate">{title || 'News Article Title'}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description || 'Short description of the news article goes here...'}
        </p>
        <a 
          href={url || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Read More
        </a>
      </div>
    </div>
  )
}
