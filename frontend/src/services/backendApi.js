import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 15000,
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

// ── AI (Bonus) ────────────────────────────────────────────
export const getAIRecommendations = (request) => API.post('/recommendations', request)
export const analyzeSentiment = (reviews) => API.post('/sentiment', { reviews })

export default API
