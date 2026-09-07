import { useEffect, useState } from 'react'
import { TrendingUp, Star } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import MovieGrid from '../components/MovieGrid'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { getTrendingMovies, getTopRatedMovies } from '../services/backendApi'

export default function Home() {
    const [trending, setTrending] = useState([])
    const [topRated, setTopRated] = useState([])
    const [loadingTrending, setLoadingTrending] = useState(true)
    const [loadingTopRated, setLoadingTopRated] = useState(true)
    const [errorTrending, setErrorTrending] = useState(null)
    const [errorTopRated, setErrorTopRated] = useState(null)

    const fetchTrending = async (isRetry = false) => {
        setLoadingTrending(true)
        setErrorTrending(null)
        try {
            const res = await getTrendingMovies()
            setTrending(res.data)
        } catch {
            if (!isRetry) {
                // Auto-retry once after 1s before showing error
                setTimeout(() => fetchTrending(true), 1000)
            } else {
                setErrorTrending('Unable to load trending movies, please try again.')
                setLoadingTrending(false)
            }
            return
        }
        setLoadingTrending(false)
    }

    const fetchTopRated = async (isRetry = false) => {
        setLoadingTopRated(true)
        setErrorTopRated(null)
        try {
            const res = await getTopRatedMovies()
            setTopRated(res.data)
        } catch {
            if (!isRetry) {
                setTimeout(() => fetchTopRated(true), 1500)
            } else {
                setErrorTopRated('Unable to load top-rated movies, please try again.')
                setLoadingTopRated(false)
            }
            return
        }
        setLoadingTopRated(false)
    }

    useEffect(() => {
        fetchTrending()
        fetchTopRated()
    }, [])

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Hero */}
            <div className="text-center mb-12 animate-slide-up">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                    Discover Your Next<br />
                    <span className="text-gradient">Favourite Movie</span>
                </h1>
                <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                    Search millions of movies, save your watchlist, and get AI-powered recommendations.
                </p>
                <div className="max-w-xl mx-auto">
                    <SearchBar size="lg" />
                </div>
            </div>

            {/* Trending */}
            <section className="mb-12">
                <h2 className="section-title">
                    <TrendingUp className="text-primary-400" size={24} />
                    Trending This Week
                </h2>
                {loadingTrending ? (
                    <Loading message="Loading trending movies…" />
                ) : errorTrending ? (
                    <ErrorMessage message={errorTrending} onRetry={fetchTrending} />
                ) : (
                    <MovieGrid movies={trending} emptyMessage="No trending movies available." />
                )}
            </section>

            {/* Top Rated */}
            <section>
                <h2 className="section-title">
                    <Star className="text-accent" size={24} />
                    Top Rated
                </h2>
                {loadingTopRated ? (
                    <Loading message="Loading top-rated movies…" />
                ) : errorTopRated ? (
                    <ErrorMessage message={errorTopRated} onRetry={fetchTopRated} />
                ) : (
                    <MovieGrid movies={topRated} emptyMessage="No top-rated movies available." />
                )}
            </section>
        </div>
    )
}
