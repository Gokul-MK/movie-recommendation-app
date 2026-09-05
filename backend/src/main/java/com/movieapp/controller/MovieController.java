package com.movieapp.controller;

import com.movieapp.dto.MovieDTO;
import com.movieapp.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    // GET /api/health
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "Movie Recommendation API"));
    }

    // GET /api/movies/search?query=
    @GetMapping("/movies/search")
    public ResponseEntity<List<MovieDTO>> search(@RequestParam String query) {
        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(movieService.search(query));
    }

    // GET /api/movies/trending
    @GetMapping("/movies/trending")
    public ResponseEntity<List<MovieDTO>> trending() {
        return ResponseEntity.ok(movieService.getTrending());
    }

    // GET /api/movies/top-rated
    @GetMapping("/movies/top-rated")
    public ResponseEntity<List<MovieDTO>> topRated() {
        return ResponseEntity.ok(movieService.getTopRated());
    }

    // GET /api/movies/{movieId}
    @GetMapping("/movies/{movieId}")
    public ResponseEntity<MovieDTO> details(@PathVariable int movieId) {
        return ResponseEntity.ok(movieService.getDetails(movieId));
    }

    // GET /api/movies/{movieId}/recommendations
    @GetMapping("/movies/{movieId}/recommendations")
    public ResponseEntity<List<MovieDTO>> recommendations(@PathVariable int movieId) {
        return ResponseEntity.ok(movieService.getRecommendations(movieId));
    }
}
