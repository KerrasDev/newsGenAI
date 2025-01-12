import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={`${styles.footer} bg-gray-800 text-white py-6`}>
      <div className="container mx-auto flex justify-between items-center">
        <p>&copy; 2025 News App. All rights reserved.</p>
        <div className="space-x-4">
          <a href="#" className="hover:text-gray-300">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300">Terms of Service</a>
          <a href="#" className="hover:text-gray-300">Contact</a>
        </div>
      </div>
    </footer>
  )
}
