package com.movieSearch.controller;

import com.movieSearch.dto.MovieSearchResponseDTO;
import com.movieSearch.service.MovieSearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // For development - configure properly for production
public class MovieSearchController {

    private static final Logger logger = LoggerFactory.getLogger(MovieSearchController.class);

    private final MovieSearchService movieSearchService;

    @Autowired
    public MovieSearchController(MovieSearchService movieSearchService) {
        this.movieSearchService = movieSearchService;
    }

    /**
     * Search movies by title
     */
    @GetMapping("/movies/search")
    public ResponseEntity<MovieSearchResponseDTO> searchMovies(
            @RequestParam("title") String title,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "type", required = false) String type) {

        logger.info("GET /api/movies/search - title: '{}', page: {}, type: {}", title, page, type);

        MovieSearchResponseDTO result = movieSearchService.searchMovies(title, page, type);
        return ResponseEntity.ok(result);
    }

    /**
     * Get movie details by IMDB ID
     */
    @GetMapping("/movies/{imdbId}")
    public ResponseEntity<MovieSearchResponseDTO> getMovieDetails(@PathVariable String imdbId) {
        logger.info("GET /api/movies/{} - Getting movie details", imdbId);

        MovieSearchResponseDTO result = movieSearchService.getMovieDetails(imdbId);
        return ResponseEntity.ok(result);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        logger.debug("GET /api/health - Health check requested");

        MovieSearchService.ServiceHealthDTO health = movieSearchService.getHealthStatus();
        return ResponseEntity.ok(health);
    }

    /**
     * Get feature flag status
     */
    @GetMapping("/flags/status")
    public ResponseEntity<?> getFlagStatus() {
        logger.debug("GET /api/flags/status - Flag status requested");

        MovieSearchService.FeatureFlagStatusDTO flagStatus = movieSearchService.getFeatureFlagStatus();
        return ResponseEntity.ok(flagStatus);
    }

    /**
     * Refresh feature flag cache (manual sync)
     */
    @PostMapping("/flags/refresh")
    public ResponseEntity<?> refreshFlags() {
        logger.info("POST /api/flags/refresh - Manual flag refresh requested");

        try {
            movieSearchService.refreshFeatureFlags();
            MovieSearchService.FeatureFlagStatusDTO flagStatus = movieSearchService.getFeatureFlagStatus();
            return ResponseEntity.ok(Map.of(
                    "message", "Feature flags refreshed successfully",
                    "flagStatus", flagStatus
            ));
        } catch (Exception e) {
            logger.error("Failed to refresh feature flags", e);
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Failed to refresh feature flags",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * Simple ping endpoint
     */
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Movie Search Service is running");
    }
}