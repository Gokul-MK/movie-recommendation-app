package com.movieapp.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "watchlist")
public class Watchlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "movie_id", nullable = false, unique = true)
    private Integer movieId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "poster_path", length = 500)
    private String posterPath;

    @Column(precision = 3, scale = 1)
    private BigDecimal rating;

    @Column(name = "release_date", length = 20)
    private String releaseDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // ── Constructors ──────────────────────────────────────────
    public Watchlist() {
    }

    public Watchlist(Integer movieId, String title, String posterPath,
            BigDecimal rating, String releaseDate) {
        this.movieId = movieId;
        this.title = title;
        this.posterPath = posterPath;
        this.rating = rating;
        this.releaseDate = releaseDate;
    }

    // ── Getters & Setters ─────────────────────────────────────
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMovieId() {
        return movieId;
    }

    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
