# 🎬 CineAI — Movie Recommendation App

A portfolio-quality full-stack movie app built with **React + Vite + Tailwind CSS** on the frontend and **Spring Boot + PostgreSQL** on the backend, integrating the **TMDB API** for movie data and **Gemini AI** for smart recommendations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v3, React Router, Axios |
| Backend | Java 17, Spring Boot 3, Spring Data JPA, Spring MVC |
| Database | PostgreSQL |
| Movie Data | TMDB API (v4 Bearer token) |
| AI | Google Gemini API |
| Testing | Postman + Playwright |

---

## Project Structure

```
movie-recommendation-app/
├── frontend/          ← React + Vite + Tailwind
│   └── src/
│       ├── components/    (Navbar, SearchBar, MovieCard, MovieGrid, Rating, Loading, ErrorMessage)
│       ├── pages/         (Home, Search, MovieDetails, Watchlist, Recommendations)
│       └── services/      (backendApi.js — ONLY place that calls the backend)
├── backend/           ← Spring Boot (Maven)
│   └── src/main/java/com/movieapp/
│       ├── controller/    (MovieController, WatchlistController, RecommendationController)
│       ├── service/       (MovieService, WatchlistService, AIRecommendationService)
│       ├── repository/    (WatchlistRepository)
│       ├── model/         (Watchlist)
│       ├── dto/           (MovieDTO, RecommendationRequest)
│       └── config/        (CorsConfig)
├── postman/           ← Postman collection (13 tests)
└── playwright/        ← E2E test (core journey)
```

---

## Prerequisites

- Java 17+, Node.js 18+, PostgreSQL running locally

---

## Setup

### 1. Database

```sql
-- In psql:
CREATE DATABASE movieapp;
```

> The table is auto-created by JPA (`spring.jpa.hibernate.ddl-auto=update`).

### 2. Environment Variables

Set these **before** starting the backend (PowerShell):

```powershell
$env:TMDB_API_KEY = "your_tmdb_v4_bearer_token"
$env:GEMINI_API_KEY = "your_gemini_api_key"   # optional, bonus feature
$env:DB_URL = "jdbc:postgresql://localhost:5432/movieapp"
$env:DB_USER = "postgres"
$env:DB_PASS = "postgres"
```

### 3. Run the Backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
# Or: mvn spring-boot:run
```

Backend starts at `http://localhost:8080`

### 4. Run the Frontend

```powershell
cd frontend
npm run dev
```

Frontend starts at `http://localhost:5173`

---

## REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/movies/search?query=` | Search movies |
| GET | `/api/movies/trending` | Trending this week |
| GET | `/api/movies/top-rated` | Top rated |
| GET | `/api/movies/{id}` | Movie details |
| GET | `/api/movies/{id}/recommendations` | Similar movies |
| POST | `/api/watchlist` | Add to watchlist |
| GET | `/api/watchlist` | Get watchlist |
| DELETE | `/api/watchlist/{id}` | Remove from watchlist |
| POST | `/api/recommendations` | AI recommendations (bonus) |
| POST | `/api/sentiment` | Sentiment analysis (bonus) |

---

## Testing

### Postman

Import `postman/MovieApp.postman_collection.json` into Postman and run the collection. Or via CLI:

```powershell
npm install -g newman
newman run postman/MovieApp.postman_collection.json
```

### Playwright E2E

```powershell
cd playwright
npm install
npx playwright install chromium
npx playwright test
```

---

## Features

- ✅ TMDB movie search, details, trending, top-rated
- ✅ Movie cards with poster, rating, genres
- ✅ Responsive dark UI (desktop, tablet, mobile)
- ✅ Watchlist (PostgreSQL-backed, no duplicates)
- ✅ Similar movies on details page  
- ✅ Loading / error / empty states on every network call
- ✅ Missing poster placeholder
- ✅ AI recommendations via Gemini (bonus)
- ✅ Sentiment analysis (bonus)
- ✅ Postman collection + Playwright E2E test

---

## Security

- API keys are **never** hardcoded or committed
- All external calls (TMDB, Gemini) go through the Spring Boot backend
- `.env` and secret files are in `.gitignore`
