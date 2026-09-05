import { useEffect, useState } from 'react'
import { Trash2, BookMarked } from 'lucide-react'
import { Link } from 'react-router-dom'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import Rating from '../components/Rating'
import { getWatchlist, removeFromWatchlist } from '../services/backendApi'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w300'

export default function Watchlist() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [removing, setRemoving] = useState(null)

    const fetchWatchlist = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await getWatchlist()
            setItems(res.data)
        } catch {
            setError('Unable to load your watchlist, please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = async (item) => {
        setRemoving(item.id)
        try {
            await removeFromWatchlist(item.id)
            setItems((prev) => prev.filter((i) => i.id !== item.id))
        } catch {
            alert('Failed to remove from watchlist.')
        } finally {
            setRemoving(null)
        }
    }

    useEffect(() => { fetchWatchlist() }, [])

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="section-title">
                <BookMarked className="text-primary-400" size={26} />
                My Watchlist
            </h1>

            {loading && <Loading message="Loading your watchlist…" />}

            {!loading && error && <ErrorMessage message={error} onRetry={fetchWatchlist} />}

            {!loading && !error && items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
                    <span className="text-6xl">📋</span>
                    <p className="text-gray-400 font-medium text-lg">Your watchlist is empty</p>
                    <p className="text-gray-600 text-sm mb-2">Browse movies and add ones you want to watch.</p>
                    <Link to="/" className="btn-primary">Explore Movies</Link>
                </div>
            )}

            {!loading && !error && items.length > 0 && (
                <div className="animate-fade-in">
                    <p className="text-gray-500 text-sm mb-6">
                        {items.length} movie{items.length !== 1 ? 's' : ''} saved
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                id={`watchlist-item-${item.id}`}
                                className="card flex gap-4 p-4 items-start"
                            >
                                {/* Poster */}
                                <Link to={`/movie/${item.movieId}`} className="shrink-0">
                                    {item.posterPath ? (
                                        <img
                                            src={`${POSTER_BASE}${item.posterPath}`}
                                            alt={item.title}
                                            className="w-16 h-24 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-16 h-24 poster-placeholder rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">🎬</span>
                                        </div>
                                    )}
                                </Link>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <Link
                                        to={`/movie/${item.movieId}`}
                                        className="font-semibold text-white text-sm leading-snug hover:text-primary-300
                               transition-colors line-clamp-2 block mb-1"
                                    >
                                        {item.title}
                                    </Link>
                                    {item.releaseDate && (
                                        <p className="text-gray-500 text-xs mb-2">{item.releaseDate.split('-')[0]}</p>
                                    )}
                                    <Rating score={item.rating} size="sm" />
                                </div>

                                {/* Remove */}
                                <button
                                    id={`remove-btn-${item.id}`}
                                    onClick={() => handleRemove(item)}
                                    disabled={removing === item.id}
                                    className="shrink-0 p-2 text-gray-600 hover:text-red-400 hover:bg-red-900/20
                             rounded-lg transition-colors duration-200"
                                    title="Remove from watchlist"
                                >
                                    {removing === item.id ? (
                                        <span className="animate-spin block border-2 border-gray-600 border-t-red-400 rounded-full w-4 h-4" />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
