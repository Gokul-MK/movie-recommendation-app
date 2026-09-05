package com.movieapp.service;

import com.movieapp.model.Watchlist;
import com.movieapp.repository.WatchlistRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class WatchlistService {

    private final WatchlistRepository repo;

    public WatchlistService(WatchlistRepository repo) {
        this.repo = repo;
    }

    public List<Watchlist> getAll() {
        return repo.findAll();
    }

    public Watchlist add(Watchlist item) {
        if (repo.existsByMovieId(item.getMovieId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Movie already in watchlist");
        }
        return repo.save(item);
    }

    public void remove(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Watchlist entry not found");
        }
        repo.deleteById(id);
    }
}
