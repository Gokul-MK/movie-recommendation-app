package com.movieapp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.movieapp.dto.MovieDTO;
import com.movieapp.dto.RecommendationRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIRecommendationService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.base.url}")
    private String geminiBaseUrl;

    private final MovieService movieService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AIRecommendationService(MovieService movieService) {
        this.movieService = movieService;
    }

    /**
     * Sends user preferences to Gemini, parses suggested movie titles,
     * then fetches real TMDB data for each suggested title.
     */
    public List<MovieDTO> getAIRecommendations(RecommendationRequest request) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            throw new RuntimeException("Gemini API key not configured");
        }

        String prompt = buildPrompt(request);
        String geminiResponse = callGemini(prompt);
        List<String> titles = parseTitles(geminiResponse);

        List<MovieDTO> results = new ArrayList<>();
        for (String title : titles) {
            try {
                List<MovieDTO> found = movieService.search(title);
                if (!found.isEmpty()) {
                    results.add(found.get(0));
                }
            } catch (Exception ignored) {
            }
        }
        return results;
    }

    public Map<String, Object> analyzeSentiment(List<String> reviews) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            throw new RuntimeException("Gemini API key not configured");
        }

        StringBuilder sb = new StringBuilder(
                "Classify each of the following movie reviews as Positive, Neutral, or Negative. " +
                        "Return ONLY a JSON array of objects with fields 'review' and 'sentiment'.\n\n");
        for (int i = 0; i < reviews.size(); i++) {
            sb.append((i + 1)).append(". ").append(reviews.get(i)).append("\n");
        }

        String raw = callGemini(sb.toString());
        try {
            // Strip markdown code fences if present
            String cleaned = raw.replaceAll("```json", "").replaceAll("```", "").trim();
            JsonNode arr = objectMapper.readTree(cleaned);
            int pos = 0, neu = 0, neg = 0;
            List<Map<String, String>> items = new ArrayList<>();
            for (JsonNode node : arr) {
                String sentiment = node.path("sentiment").asText("Neutral");
                items.add(Map.of("review", node.path("review").asText(), "sentiment", sentiment));
                switch (sentiment.toLowerCase()) {
                    case "positive" -> pos++;
                    case "negative" -> neg++;
                    default -> neu++;
                }
            }
            return Map.of("results", items,
                    "summary", Map.of("positive", pos, "neutral", neu, "negative", neg));
        } catch (Exception e) {
            return Map.of("error", "Could not parse sentiment response", "raw", raw);
        }
    }

    // ── Private helpers ────────────────────────────────────────

    private String buildPrompt(RecommendationRequest req) {
        StringBuilder sb = new StringBuilder();
        sb.append(
                "You are a movie recommendation expert. Recommend exactly 10 movies based on the following preferences.\n");
        sb.append("Return ONLY a JSON array of movie title strings, like: [\"Movie A\", \"Movie B\", ...]\n\n");
        if (req.getPreferences() != null && !req.getPreferences().isBlank())
            sb.append("Preferences: ").append(req.getPreferences()).append("\n");
        if (req.getFavoriteMovies() != null && !req.getFavoriteMovies().isEmpty())
            sb.append("Favorite movies: ").append(String.join(", ", req.getFavoriteMovies())).append("\n");
        if (req.getGenres() != null && !req.getGenres().isEmpty())
            sb.append("Preferred genres: ").append(String.join(", ", req.getGenres())).append("\n");
        if (req.getMinRating() != null)
            sb.append("Minimum IMDB/TMDB rating: ").append(req.getMinRating()).append("\n");
        sb.append("\nReturn ONLY the JSON array. No explanation.");
        return sb.toString();
    }

    private String callGemini(String prompt) {
        String url = geminiBaseUrl + "?key=" + geminiApiKey;

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    url, new HttpEntity<>(body, headers), String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            return root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();
        } catch (Exception e) {
            throw new RuntimeException("Gemini API error: " + e.getMessage(), e);
        }
    }

    private List<String> parseTitles(String raw) {
        try {
            String cleaned = raw.replaceAll("```json", "").replaceAll("```", "").trim();
            JsonNode arr = objectMapper.readTree(cleaned);
            List<String> titles = new ArrayList<>();
            for (JsonNode node : arr) {
                titles.add(node.asText());
            }
            return titles;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
