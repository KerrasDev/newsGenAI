import Head from 'next/head'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import SearchBar from '../components/SearchBar/SearchBar'
import Sidebar from '../components/Sidebar/Sidebar'
import NewsCard from '../components/NewsCard/NewsCard'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>News App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 grid grid-cols-4 gap-6">
        <Sidebar className="col-span-1" />
        
        <div className="col-span-3">
          <SearchBar />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {/* Placeholder for news cards */}
            <NewsCard />
            <NewsCard />
            <NewsCard />
            <NewsCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
