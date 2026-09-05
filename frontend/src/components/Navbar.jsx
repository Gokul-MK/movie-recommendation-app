import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Film, Search, BookMarked, Sparkles, Menu, X } from 'lucide-react'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setMenuOpen(false)
        }
    }

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/watchlist', label: 'Watchlist', icon: <BookMarked size={16} /> },
        { to: '/recommendations', label: 'AI Picks', icon: <Sparkles size={16} /> },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-x-0 border-t-0 rounded-none
                    border-b border-white/10 backdrop-blur-xl bg-dark-900/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center glow">
                            <Film size={20} className="text-white" />
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight hidden sm:block">
                            Cine<span className="text-gradient">AI</span>
                        </span>
                    </Link>

                    {/* Desktop search */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm items-center gap-2">
                        <div className="relative w-full">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search movies…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field pl-9 py-2 text-sm"
                            />
                        </div>
                        <button type="submit" className="btn-primary py-2 px-4 text-sm shrink-0">
                            Search
                        </button>
                    </form>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ to, label, icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                   ${isActive
                                        ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-dark-700'
                                    }`
                                }
                            >
                                {icon}
                                {label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-gray-400 hover:text-white transition-colors"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden pb-4 space-y-2 animate-fade-in">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search movies…"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input-field pl-9 py-2 text-sm"
                                />
                            </div>
                            <button type="submit" className="btn-primary py-2 px-4 text-sm">Go</button>
                        </form>
                        {navLinks.map(({ to, label, icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                   ${isActive ? 'bg-primary-600/20 text-primary-300' : 'text-gray-400 hover:text-white'}`
                                }
                            >
                                {icon}
                                {label}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    )
}
