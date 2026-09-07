import { useState } from 'react'
import { Sparkles, X, Plus } from 'lucide-react'
import MovieGrid from '../components/MovieGrid'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { getAIRecommendations } from '../services/backendApi'

// ── IMPORTANT: defined OUTSIDE the parent so React never remounts it on re-render ──
// Defining components inside a render function causes them to lose focus after each keystroke
function TagInput({ tags, value, onChange, onAdd, onRemove, placeholder }) {
    return (
        <div>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAdd() } }}
                    placeholder={placeholder}
                    className="input-field text-sm py-2"
                />
                <button
                    type="button"
                    onClick={onAdd}
                    className="shrink-0 bg-dark-600 hover:bg-dark-500 text-primary-400 px-3 py-2 rounded-xl border border-dark-500"
                >
                    <Plus size={16} />
                </button>
            </div>
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map(t => (
                        <span
                            key={t}
                            className="flex items-center gap-1 bg-primary-900/40 border border-primary-500/30 text-primary-300 text-xs px-3 py-1 rounded-full"
                        >
                            {t}
                            <button
                                type="button"
                                onClick={() => onRemove(t)}
                                className="hover:text-red-400 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function Recommendations() {
    const [preferences, setPreferences] = useState('')
    const [genres, setGenres] = useState([])
    const [genreInput, setGenreInput] = useState('')
    const [favorites, setFavorites] = useState([])
    const [favInput, setFavInput] = useState('')
    const [minRating, setMinRating] = useState('')

    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [submitted, setSubmitted] = useState(false)

    const addTag = (value, setter, inputSetter) => {
        const v = value.trim()
        if (v) {
            setter((prev) => (prev.includes(v) ? prev : [...prev, v]))
            inputSetter('')
        }
    }
    const removeTag = (value, setter) => setter((prev) => prev.filter((t) => t !== value))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMovies([])
        setSubmitted(true)
        try {
            const res = await getAIRecommendations({
                preferences,
                genres,
                favoriteMovies: favorites,
                minRating: minRating ? parseFloat(minRating) : null,
            })
            setMovies(res.data)
        } catch (err) {
            if (err.response?.status === 500 && err.response?.data?.includes?.('key')) {
                setError('Gemini API key not configured on the server. Please add GEMINI_API_KEY to your environment variables.')
            } else {
                setError('Unable to get AI recommendations. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="section-title">
                <Sparkles className="text-primary-400" size={26} />
                AI Movie Recommendations
            </h1>
            <p className="text-gray-400 text-sm mb-8">
                Describe what you're in the mood for and our AI will suggest the perfect movies. Powered by Gemini.
            </p>

            <form onSubmit={handleSubmit} className="glass p-6 sm:p-8 mb-10 space-y-6">
                {/* Free text */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Describe your preferences *
                    </label>
                    <textarea
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        placeholder="e.g. thrilling sci-fi with a twist ending and strong female lead…"
                        rows={3}
                        required
                        className="input-field resize-none text-sm"
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    {/* Genres */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Genres</label>
                        <TagInput
                            tags={genres}
                            value={genreInput}
                            onChange={setGenreInput}
                            onAdd={() => addTag(genreInput, setGenres, setGenreInput)}
                            onRemove={(v) => removeTag(v, setGenres)}
                            placeholder="e.g. Thriller, Comedy…"
                        />
                    </div>

                    {/* Favorite movies */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Favourite Movies</label>
                        <TagInput
                            tags={favorites}
                            value={favInput}
                            onChange={setFavInput}
                            onAdd={() => addTag(favInput, setFavorites, setFavInput)}
                            onRemove={(v) => removeTag(v, setFavorites)}
                            placeholder="e.g. Inception, Parasite…"
                        />
                    </div>
                </div>

                {/* Min rating */}
                <div className="sm:w-48">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Rating</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.5"
                        value={minRating}
                        onChange={(e) => setMinRating(e.target.value)}
                        placeholder="e.g. 7.5"
                        className="input-field text-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" />
                            Getting Recommendations…
                        </>
                    ) : (
                        <>
                            <Sparkles size={16} /> Get Recommendations
                        </>
                    )}
                </button>
            </form>

            {loading && <Loading message="Consulting the AI oracle…" />}
            {!loading && error && <ErrorMessage message={error} />}
            {!loading && submitted && !error && movies.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    <p>No matching movies found. Try different preferences.</p>
                </div>
            )}
            {!loading && movies.length > 0 && (
                <div className="animate-slide-up">
                    <h2 className="text-xl font-bold text-white mb-6">
                        ✨ {movies.length} AI-Curated Picks
                    </h2>
                    <MovieGrid movies={movies} />
                </div>
            )}
        </div>
    )
}
