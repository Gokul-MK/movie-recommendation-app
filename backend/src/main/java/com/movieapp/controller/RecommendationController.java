package com.movieapp.controller;

import com.movieapp.dto.MovieDTO;
import com.movieapp.dto.RecommendationRequest;
import com.movieapp.service.AIRecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RecommendationController {

    private final AIRecommendationService aiService;

    public RecommendationController(AIRecommendationService aiService) {
        this.aiService = aiService;
    }

    // POST /api/recommendations
    @PostMapping("/recommendations")
    public ResponseEntity<List<MovieDTO>> getRecommendations(
            @RequestBody RecommendationRequest request) {
        return ResponseEntity.ok(aiService.getAIRecommendations(request));
    }

    // POST /api/sentiment
    @PostMapping("/sentiment")
    public ResponseEntity<Map<String, Object>> analyzeSentiment(
            @RequestBody Map<String, List<String>> body) {
        List<String> reviews = body.get("reviews");
        if (reviews == null || reviews.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(aiService.analyzeSentiment(reviews));
    }
}
