package com.movieSearch.client;

import com.movieSearch.dto.MovieSearchResponseDTO;
import com.movieSearch.exception.ExternalApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Component
public class OMDBClient {

    private static final Logger logger = LoggerFactory.getLogger(OMDBClient.class);

    private final WebClient webClient;
    private final String apiKey;

    public OMDBClient(WebClient.Builder webClientBuilder,
                      @Value("${omdb.api.key}") String apiKey,
                      @Value("${omdb.api.url:http://www.omdbapi.com/}") String apiUrl) {
        this.apiKey = apiKey;
        this.webClient = webClientBuilder
                .baseUrl(apiUrl)
                .build();

        logger.info("OMDB Client initialized with API URL: {}", apiUrl);
    }

    /**
     * Search for movies by title
     */
    public MovieSearchResponseDTO searchMovies(String title) {
        return searchMovies(title, 1, null);
    }

    /**
     * Search for movies by title with pagination
     */
    public MovieSearchResponseDTO searchMovies(String title, int page) {
        return searchMovies(title, page, null);
    }

    /**
     * Search for movies by title with type filter
     */
    public MovieSearchResponseDTO searchMovies(String title, int page, String type) {
        logger.info("Searching movies with title: '{}', page: {}, type: {}", title, page, type);

        try {
            Mono<MovieSearchResponseDTO> responseMono = webClient
                    .get()
                    .uri(uriBuilder -> {
                        var builder = uriBuilder
                                .queryParam("apikey", apiKey)
                                .queryParam("s", title)
                                .queryParam("page", page);

                        if (type != null && !type.trim().isEmpty()) {
                            builder.queryParam("type", type);
                        }

                        return builder.build();
                    })
                    .retrieve()
                    .bodyToMono(MovieSearchResponseDTO.class)
                    .timeout(Duration.ofSeconds(10));

            MovieSearchResponseDTO response = responseMono.block();

            if (response == null) {
                logger.warn("Received null response from OMDB API for title: {}", title);
                throw new ExternalApiException("No response received from movie database");
            }

            if ("False".equals(response.getResponse()) && response.getError() != null) {
                logger.warn("OMDB API returned error for title '{}': {}", title, response.getError());
                // Don't throw exception for "Movie not found" - return the response as is
                // The frontend can handle this case
            }

            logger.debug("Successfully retrieved {} results for title: {}",
                    response.getSearch() != null ? response.getSearch().size() : 0, title);

            return response;

        } catch (WebClientException e) {
            logger.error("Error calling OMDB API for title: {}", title, e);
            throw new ExternalApiException("Failed to search movies: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error while searching movies for title: {}", title, e);
            throw new ExternalApiException("Unexpected error occurred while searching movies", e);
        }
    }

    /**
     * Get movie details by IMDB ID
     */
    public MovieSearchResponseDTO getMovieById(String imdbId) {
        logger.info("Getting movie details for IMDB ID: {}", imdbId);

        try {
            Mono<MovieSearchResponseDTO> responseMono = webClient
                    .get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("apikey", apiKey)
                            .queryParam("i", imdbId)
                            .build())
                    .retrieve()
                    .bodyToMono(MovieSearchResponseDTO.class)
                    .timeout(Duration.ofSeconds(10));

            MovieSearchResponseDTO response = responseMono.block();

            if (response == null) {
                logger.warn("Received null response from OMDB API for IMDB ID: {}", imdbId);
                throw new ExternalApiException("No response received from movie database");
            }

            logger.debug("Successfully retrieved movie details for IMDB ID: {}", imdbId);
            return response;

        } catch (WebClientException e) {
            logger.error("Error calling OMDB API for IMDB ID: {}", imdbId, e);
            throw new ExternalApiException("Failed to get movie details: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error while getting movie details for IMDB ID: {}", imdbId, e);
            throw new ExternalApiException("Unexpected error occurred while getting movie details", e);
        }
    }

    /**
     * Health check for OMDB API
     */
    public boolean isApiHealthy() {
        try {
            // Try a simple search to check if API is responsive
            MovieSearchResponseDTO response = searchMovies("test", 1);
            return response != null;
        } catch (Exception e) {
            logger.warn("OMDB API health check failed", e);
            return false;
        }
    }
}