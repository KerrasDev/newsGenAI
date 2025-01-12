import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={`${styles.header} bg-blue-600 text-white py-4`}>
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">News App</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-blue-200">Home</a></li>
            <li><a href="#" className="hover:text-blue-200">Categories</a></li>
            <li><a href="#" className="hover:text-blue-200">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
