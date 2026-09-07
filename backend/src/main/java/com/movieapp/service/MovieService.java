package com.movieapp.service;

import com.movieapp.dto.MovieDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@Service
public class MovieService {

    @Value("${tmdb.api.key}")
    private String tmdbApiKey;

    @Value("${tmdb.base.url}")
    private String tmdbBaseUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MovieService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // ── Helper: build authenticated headers ───────────────────
    private HttpHeaders authHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(tmdbApiKey);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        // User-Agent prevents TMDB from resetting connections on Java HTTP clients
        headers.set("User-Agent", "CineAI/1.0 (MovieRecommendationApp)");
        return headers;
    }

    // ── Helper: GET with 1 automatic retry on connection errors ──
    private String getWithRetry(String url) {
        int attempts = 0;
        Exception last = null;
        while (attempts < 2) {
            try {
                ResponseEntity<String> response = restTemplate.exchange(
                        url, HttpMethod.GET, new HttpEntity<>(authHeaders()), String.class);
                return response.getBody();
            } catch (Exception e) {
                last = e;
                attempts++;
                if (attempts < 2) {
                    try { Thread.sleep(500); } catch (InterruptedException ignored) {}
                }
            }
        }
        throw new RuntimeException("TMDB API error: " + last.getMessage(), last);
    }

    // ── Helper: GET and parse "results" array ─────────────────
    private List<MovieDTO> fetchResultsList(String url) {
        try {
            String body = getWithRetry(url);
            JsonNode root = objectMapper.readTree(body);
            JsonNode results = root.path("results");
            List<MovieDTO> movies = new ArrayList<>();
            for (JsonNode node : results) {
                movies.add(objectMapper.treeToValue(node, MovieDTO.class));
            }
            return movies;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("TMDB API error: " + e.getMessage(), e);
        }
    }

    // ── Public methods ────────────────────────────────────────

    public List<MovieDTO> search(String query) {
        String url = UriComponentsBuilder
                .fromHttpUrl(tmdbBaseUrl + "/search/movie")
                .queryParam("query", query)
                .queryParam("include_adult", false)
                .build()
                .toUriString();
        return fetchResultsList(url);
    }

    public MovieDTO getDetails(int movieId) {
        String url = tmdbBaseUrl + "/movie/" + movieId;
        try {
            String body = getWithRetry(url);
            return objectMapper.readValue(body, MovieDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("TMDB API error: " + e.getMessage(), e);
        }
    }

    public List<MovieDTO> getRecommendations(int movieId) {
        String url = tmdbBaseUrl + "/movie/" + movieId + "/recommendations";
        return fetchResultsList(url);
    }

    public List<MovieDTO> getTrending() {
        String url = tmdbBaseUrl + "/trending/movie/week";
        return fetchResultsList(url);
    }

    public List<MovieDTO> getTopRated() {
        String url = tmdbBaseUrl + "/movie/top_rated";
        return fetchResultsList(url);
    }
}
