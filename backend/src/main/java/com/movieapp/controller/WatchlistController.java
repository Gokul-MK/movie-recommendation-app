package com.movieapp.controller;

import com.movieapp.model.Watchlist;
import com.movieapp.service.WatchlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    // GET /api/watchlist
    @GetMapping
    public ResponseEntity<List<Watchlist>> getAll() {
        return ResponseEntity.ok(watchlistService.getAll());
    }

    // POST /api/watchlist
    @PostMapping
    public ResponseEntity<Watchlist> add(@RequestBody Map<String, Object> body) {
        Watchlist item = new Watchlist();
        item.setMovieId(((Number) body.get("movieId")).intValue());
        item.setTitle((String) body.get("title"));
        item.setPosterPath((String) body.get("posterPath"));
        Object ratingObj = body.get("rating");
        if (ratingObj != null) {
            item.setRating(new BigDecimal(ratingObj.toString()));
        }
        item.setReleaseDate((String) body.get("releaseDate"));
        return ResponseEntity.status(HttpStatus.CREATED).body(watchlistService.add(item));
    }

    // DELETE /api/watchlist/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        watchlistService.remove(id);
        return ResponseEntity.noContent().build();
    }
}
