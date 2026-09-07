import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Longer timeout for AI calls (Gemini + multiple TMDB searches can take time)
const AI_API = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// ── Movies ─────────────────────────────────────────────────
export const searchMovies = (query) => API.get(`/movies/search?query=${encodeURIComponent(query)}`)
export const getMovieDetails = (id) => API.get(`/movies/${id}`)
export const getMovieRecommendations = (id) => API.get(`/movies/${id}/recommendations`)
export const getTrendingMovies = () => API.get('/movies/trending')
export const getTopRatedMovies = () => API.get('/movies/top-rated')

// ── Watchlist ─────────────────────────────────────────────
export const getWatchlist = () => API.get('/watchlist')
export const addToWatchlist = (movie) => API.post('/watchlist', movie)
export const removeFromWatchlist = (id) => API.delete(`/watchlist/${id}`)

// ── AI (60s timeout — Gemini + 10 TMDB searches) ──────────
export const getAIRecommendations = (request) => AI_API.post('/recommendations', request)
export const analyzeSentiment = (reviews) => AI_API.post('/sentiment', { reviews })

export default API
