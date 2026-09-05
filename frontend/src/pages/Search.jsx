import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import MovieGrid from '../components/MovieGrid'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { searchMovies } from '../services/backendApi'

export default function Search() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q') || ''

    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searched, setSearched] = useState(false)

    const doSearch = async (q) => {
        if (!q.trim()) return
        setLoading(true)
        setError(null)
        setSearched(true)
        try {
            const res = await searchMovies(q)
            setMovies(res.data)
        } catch {
            setError('Unable to search movies, please try again.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (query) doSearch(query)
        else {
            setMovies([])
            setSearched(false)
        }
    }, [query])

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-4">
                    {query ? `Results for "${query}"` : 'Search Movies'}
                </h1>
                <SearchBar initialQuery={query} />
            </div>

            {loading && <Loading message={`Searching for "${query}"…`} />}

            {!loading && error && (
                <ErrorMessage message={error} onRetry={() => doSearch(query)} />
            )}

            {!loading && !error && searched && movies.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
                    <div className="w-16 h-16 bg-dark-700 rounded-2xl flex items-center justify-center">
                        <SearchX size={28} className="text-gray-500" />
                    </div>
                    <p className="text-gray-400 font-medium">No results found for "{query}"</p>
                    <p className="text-gray-600 text-sm">Try a different title, genre, or actor name.</p>
                </div>
            )}

            {!loading && !error && movies.length > 0 && (
                <div className="animate-fade-in">
                    <p className="text-gray-500 text-sm mb-4">
                        Found {movies.length} result{movies.length !== 1 ? 's' : ''}
                    </p>
                    <MovieGrid movies={movies} />
                </div>
            )}

            {!query && !searched && (
                <div className="flex flex-col items-center justify-center py-20 gap-3 animate-fade-in">
                    <span className="text-6xl">🔍</span>
                    <p className="text-gray-400">Enter a movie title to get started</p>
                </div>
            )}
        </div>
    )
}
