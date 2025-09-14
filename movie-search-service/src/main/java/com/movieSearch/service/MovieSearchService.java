package com.movieSearch.service;

import com.movieSearch.client.OMDBClient;
import com.movieSearch.dto.MovieSearchResponseDTO;
import com.movieSearch.exception.MaintenanceModeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class MovieSearchService {

    private static final Logger logger = LoggerFactory.getLogger(MovieSearchService.class);

    private final OMDBClient omdbClient;
    private final FeatureFlagCacheService flagCacheService;

    @Autowired
    public MovieSearchService(OMDBClient omdbClient, FeatureFlagCacheService flagCacheService) {
        this.omdbClient = omdbClient;
        this.flagCacheService = flagCacheService;
    }

    /**
     * Search movies by title
     */
    public MovieSearchResponseDTO searchMovies(String title) {
        return searchMovies(title, 1, null);
    }

    /**
     * Search movies by title with pagination
     */
    public MovieSearchResponseDTO searchMovies(String title, int page) {
        return searchMovies(title, page, null);
    }

    /**
     * Search movies by title with optional type filter and pagination
     */
    @Cacheable(value = "movieSearch", key = "#title + '_' + #page + '_' + (#type != null ? #type : 'all')",
            condition = "#title != null && #title.length() > 2")
    public MovieSearchResponseDTO searchMovies(String title, int page, String type) {
        logger.info("Searching movies: title='{}', page={}, type={}", title, page, type);

        // Check maintenance mode first
        if (flagCacheService.isMaintenanceModeEnabled()) {
            logger.warn("Movie search blocked due to maintenance mode");
            throw new MaintenanceModeException("Service is currently under maintenance. Please try again later.");
        }

        // Validate input
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Movie title cannot be empty");
        }

        if (page < 1) {
            throw new IllegalArgumentException("Page number must be greater than 0");
        }

        if (title.trim().length() < 2) {
            throw new IllegalArgumentException("Movie title must be at least 2 characters long");
        }

        try {
            MovieSearchResponseDTO result = omdbClient.searchMovies(title.trim(), page, type);
            logger.info("Movie search completed for title '{}' - Found {} results",
                    title, result.getSearch() != null ? result.getSearch().size() : 0);
            return result;

        } catch (Exception e) {
            logger.error("Failed to search movies for title: {}", title, e);
            throw e; // Re-throw to be handled by global exception handler
        }
    }

    /**
     * Get movie details by IMDB ID
     */
    @Cacheable(value = "movieDetails", key = "#imdbId")
    public MovieSearchResponseDTO getMovieDetails(String imdbId) {
        logger.info("Getting movie details for IMDB ID: {}", imdbId);

        // Check maintenance mode
        if (flagCacheService.isMaintenanceModeEnabled()) {
            logger.warn("Movie details request blocked due to maintenance mode");
            throw new MaintenanceModeException("Service is currently under maintenance. Please try again later.");
        }

        // Validate input
        if (imdbId == null || imdbId.trim().isEmpty()) {
            throw new IllegalArgumentException("IMDB ID cannot be empty");
        }

        try {
            MovieSearchResponseDTO result = omdbClient.getMovieById(imdbId.trim());
            logger.info("Movie details retrieved for IMDB ID: {}", imdbId);
            return result;

        } catch (Exception e) {
            logger.error("Failed to get movie details for IMDB ID: {}", imdbId, e);
            throw e;
        }
    }

    /**
     * Get service health status
     */
    public ServiceHealthDTO getHealthStatus() {
        boolean maintenanceMode = flagCacheService.isMaintenanceModeEnabled();
        boolean omdbHealthy = !maintenanceMode && omdbClient.isApiHealthy();

        ServiceHealthDTO health = new ServiceHealthDTO(
                !maintenanceMode && omdbHealthy ? "UP" : "DOWN",
                maintenanceMode,
                omdbHealthy
        );

        logger.debug("Service health check: {}", health);
        return health;
    }

    /**
     * Get current feature flag status for this service
     */
    public FeatureFlagStatusDTO getFeatureFlagStatus() {
        return new FeatureFlagStatusDTO(
                flagCacheService.isDarkModeEnabled(),
                flagCacheService.isMaintenanceModeEnabled(),
                flagCacheService.getStats()
        );
    }

    /**
     * Refresh feature flags from Feature Flag Service
     */
    public void refreshFeatureFlags() {
        logger.info("Manually refreshing feature flags");
        flagCacheService.refreshCache();
    }

    // Health DTO
    public static class ServiceHealthDTO {
        private final String status;
        private final boolean maintenanceMode;
        private final boolean omdbApiHealthy;

        public ServiceHealthDTO(String status, boolean maintenanceMode, boolean omdbApiHealthy) {
            this.status = status;
            this.maintenanceMode = maintenanceMode;
            this.omdbApiHealthy = omdbApiHealthy;
        }

        public String getStatus() { return status; }
        public boolean isMaintenanceMode() { return maintenanceMode; }
        public boolean isOmdbApiHealthy() { return omdbApiHealthy; }
    }

    // Feature Flag Status DTO
    public static class FeatureFlagStatusDTO {
        private final boolean darkMode;
        private final boolean maintenanceMode;
        private final FeatureFlagCacheService.CacheStats cacheStats;

        public FeatureFlagStatusDTO(boolean darkMode, boolean maintenanceMode,
                                    FeatureFlagCacheService.CacheStats cacheStats) {
            this.darkMode = darkMode;
            this.maintenanceMode = maintenanceMode;
            this.cacheStats = cacheStats;
        }

        public boolean isDarkMode() { return darkMode; }
        public boolean isMaintenanceMode() { return maintenanceMode; }
        public FeatureFlagCacheService.CacheStats getCacheStats() { return cacheStats; }
    }
}