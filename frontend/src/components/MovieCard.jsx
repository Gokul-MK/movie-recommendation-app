import { Link } from 'react-router-dom'
import { ImageOff } from 'lucide-react'
import Rating from './Rating'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

export default function MovieCard({ movie, action }) {
    const posterUrl = movie.posterPath
        ? `${POSTER_BASE}${movie.posterPath}`
        : null

    const year = movie.releaseDate ? movie.releaseDate.split('-')[0] : null

    return (
        <div className="card group animate-fade-in flex flex-col h-full">
            {/* Poster */}
            <Link to={`/movie/${movie.id}`} className="block relative overflow-hidden aspect-[2/3] shrink-0">
                {posterUrl ? (
                    <img
                        src={posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                    />
                ) : null}
                {/* Placeholder shown if no poster or image fails */}
                <div
                    className={`poster-placeholder w-full h-full flex-col gap-2 ${posterUrl ? 'hidden' : 'flex'}`}
                    style={{ minHeight: '200px' }}
                >
                    <ImageOff size={36} className="text-gray-600" />
                    <span className="text-xs text-gray-600 text-center px-4">No Poster</span>
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Rating badge overlay */}
                {movie.voteAverage > 0 && (
                    <div className="absolute top-2 right-2 glass px-2 py-1 text-xs font-bold text-accent
                          flex items-center gap-1 border border-accent/30">
                        ⭐ {Number(movie.voteAverage).toFixed(1)}
                    </div>
                )}
            </Link>

            {/* Info */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                <div className="flex-1">
                    <Link
                        to={`/movie/${movie.id}`}
                        className="font-semibold text-white text-sm leading-snug hover:text-primary-300
                       transition-colors line-clamp-2 block"
                    >
                        {movie.title}
                    </Link>
                    {year && (
                        <span className="text-xs text-gray-500 mt-1 block">{year}</span>
                    )}
                    {movie.overview && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                            {movie.overview}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-dark-600">
                    <Rating score={movie.voteAverage} size="sm" />
                    {action && (
                        <div className="shrink-0">{action(movie)}</div>
                    )}
                </div>
            </div>
        </div>
    )
}
