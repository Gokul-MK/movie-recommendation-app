import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Search from './pages/Search'
import MovieDetails from './pages/MovieDetails'
import Watchlist from './pages/Watchlist'
import Recommendations from './pages/Recommendations'

export default function App() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
      </main>
    </div>
  )
}
