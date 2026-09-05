package com.movieapp.dto;

import java.util.List;

public class RecommendationRequest {
    private String preferences;
    private List<String> favoriteMovies;
    private List<String> genres;
    private Double minRating;

    // ── Getters & Setters ─────────────────────────────────────
    public String getPreferences() {
        return preferences;
    }

    public void setPreferences(String preferences) {
        this.preferences = preferences;
    }

    public List<String> getFavoriteMovies() {
        return favoriteMovies;
    }

    public void setFavoriteMovies(List<String> favoriteMovies) {
        this.favoriteMovies = favoriteMovies;
    }

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }

    public Double getMinRating() {
        return minRating;
    }

    public void setMinRating(Double minRating) {
        this.minRating = minRating;
    }
}
