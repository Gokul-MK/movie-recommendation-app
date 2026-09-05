import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft, Clock, Globe, BookmarkPlus, BookmarkCheck,
    Star, TrendingUp, Calendar
} from 'lucide-react'
import Rating from '../components/Rating'
import MovieGrid from '../components/MovieGrid'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import {
    getMovieDetails, getMovieRecommendations,
    addToWatchlist, getWatchlist
} from '../services/backendApi'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w780'

export default function MovieDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [movie, setMovie] = useState(null)
    const [similar, setSimilar] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [inWatchlist, setInWatchlist] = useState(false)
    const [addingToWatchlist, setAddingToWatchlist] = useState(false)
    const [watchlistMsg, setWatchlistMsg] = useState('')

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const [detailRes, recRes, wlRes] = await Promise.all([
                getMovieDetails(id),
                getMovieRecommendations(id),
                getWatchlist(),
            ])
            setMovie(detailRes.data)
            setSimilar(recRes.data.slice(0, 12))
            const wl = wlRes.data
            setInWatchlist(wl.some((w) => w.movieId === detailRes.data.id))
        } catch {
            setError('Unable to load movie details, please try again.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchData()
    }, [id])

    const handleWatchlist = async () => {
        if (inWatchlist || addingToWatchlist) return
        setAddingToWatchlist(true)
        try {
            await addToWatchlist({
                movieId: movie.id,
                title: movie.title,
                posterPath: movie.posterPath,
                rating: movie.voteAverage,
                releaseDate: movie.releaseDate,
            })
            setInWatchlist(true)
            setWatchlistMsg('Added to watchlist!')
            setTimeout(() => setWatchlistMsg(''), 3000)
        } catch (err) {
            if (err.response?.status === 409) {
                setInWatchlist(true)
                setWatchlistMsg('Already in watchlist.')
            } else {
                setWatchlistMsg('Failed to add. Please try again.')
            }
            setTimeout(() => setWatchlistMsg(''), 3000)
        } finally {
            setAddingToWatchlist(false)
        }
    }

    if (loading) return <div className="py-20"><Loading message="Loading movie details…" /></div>
    if (error || !movie) return <div className="max-w-3xl mx-auto px-4 py-20"><ErrorMessage message={error} onRetry={fetchData} /></div>

    const year = movie.releaseDate?.split('-')[0]
    const posterUrl = movie.posterPath ? `${POSTER_BASE}${movie.posterPath}` : null

    return (
        <div className="animate-fade-in">
            {/* Backdrop / Hero */}
            <div className="relative min-h-[420px] sm:min-h-[500px] flex items-end">
                {/* Background poster blur */}
                {posterUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${posterUrl})` }}
                    >
                        <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm" />
                    </div>
                )}
                {!posterUrl && <div className="absolute inset-0 bg-dark-800" />}

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>

                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        {/* Poster */}
                        <div className="shrink-0 w-40 sm:w-52 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            {posterUrl ? (
                                <img src={posterUrl} alt={movie.title} className="w-full h-auto" />
                            ) : (
                                <div className="w-full aspect-[2/3] poster-placeholder flex items-center justify-center">
                                    <span className="text-4xl">🎬</span>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
                                {movie.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                {year && (
                                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                                        <Calendar size={14} /> {year}
                                    </span>
                                )}
                                {movie.runtime > 0 && (
                                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                                        <Clock size={14} /> {movie.runtime} min
                                    </span>
                                )}
                                <Rating score={movie.voteAverage} size="lg" />
                                {movie.popularity && (
                                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                                        <TrendingUp size={14} /> {Math.round(movie.popularity).toLocaleString()} popularity
                                    </span>
                                )}
                            </div>

                            {/* Genres */}
                            {movie.genres?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {movie.genres.map((g) => (
                                        <span key={g.id} className="badge">{g.name}</span>
                                    ))}
                                </div>
                            )}

                            {/* Overview */}
                            {movie.overview && (
                                <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl text-sm sm:text-base">
                                    {movie.overview}
                                </p>
                            )}

                            {/* Watchlist button */}
                            <div className="flex items-center gap-4">
                                <button
                                    id="add-to-watchlist-btn"
                                    onClick={handleWatchlist}
                                    disabled={inWatchlist || addingToWatchlist}
                                    className={`flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all duration-200
                    ${inWatchlist
                                            ? 'bg-green-600/20 text-green-400 border border-green-500/30 cursor-default'
                                            : 'btn-primary'
                                        }`}
                                >
                                    {inWatchlist ? (
                                        <><BookmarkCheck size={18} /> In Watchlist</>
                                    ) : addingToWatchlist ? (
                                        <><span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" /> Adding…</>
                                    ) : (
                                        <><BookmarkPlus size={18} /> Add to Watchlist</>
                                    )}
                                </button>
                                {watchlistMsg && (
                                    <span className="text-sm text-green-400 animate-fade-in">{watchlistMsg}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar / Recommended Movies */}
            {similar.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h2 className="section-title">
                        <Globe className="text-primary-400" size={22} />
                        You Might Also Like
                    </h2>
                    <MovieGrid movies={similar} />
                </div>
            )}
        </div>
    )
}
