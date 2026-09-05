import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export default function SearchBar({ initialQuery = '', size = 'md' }) {
    const [query, setQuery] = useState(initialQuery)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`)
        }
    }

    const isLarge = size === 'lg'

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 w-full">
            <div className="relative flex-1">
                <Search
                    size={isLarge ? 20 : 16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
                <input
                    id="search-input"
                    type="text"
                    placeholder="Search movies, genres, actors…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`input-field ${isLarge ? 'text-base py-4 pl-12' : 'text-sm py-3 pl-10'}`}
                />
            </div>
            <button
                type="submit"
                id="search-button"
                className={`btn-primary shrink-0 ${isLarge ? 'px-8 py-4' : 'px-6 py-3 text-sm'}`}
            >
                Search
            </button>
        </form>
    )
}
