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

    // Injected RestTemplate bean from AppConfig
    public MovieService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // ── Helper: build authenticated headers ───────────────────
    private HttpHeaders authHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(tmdbApiKey);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        return headers;
    }

    // ── Helper: GET and parse "results" array ─────────────────
    private List<MovieDTO> fetchResultsList(String url) {
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(authHeaders()), String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode results = root.path("results");
            List<MovieDTO> movies = new ArrayList<>();
            for (JsonNode node : results) {
                movies.add(objectMapper.treeToValue(node, MovieDTO.class));
            }
            return movies;
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
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(authHeaders()), String.class);
            return objectMapper.readValue(response.getBody(), MovieDTO.class);
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
