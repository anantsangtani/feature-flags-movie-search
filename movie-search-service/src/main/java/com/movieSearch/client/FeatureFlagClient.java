package com.movieSearch.client;

import com.movieSearch.dto.FeatureFlagResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;

@Component
public class FeatureFlagClient {

    private static final Logger logger = LoggerFactory.getLogger(FeatureFlagClient.class);

    private final WebClient webClient;

    public FeatureFlagClient(WebClient.Builder webClientBuilder,
                             @Value("${feature-flag.service.url:http://localhost:8080}") String serviceUrl) {
        this.webClient = webClientBuilder
                .baseUrl(serviceUrl)
                .build();

        logger.info("Feature Flag Client initialized with service URL: {}", serviceUrl);
    }

    /**
     * Fetch all current feature flags from Feature Flag Service
     */
    public List<FeatureFlagResponseDTO> getAllFlags() {
        logger.info("Fetching all feature flags from Feature Flag Service");

        try {
            Mono<List<FeatureFlagResponseDTO>> responseMono = webClient
                    .get()
                    .uri("/api/flags")
                    .retrieve()
                    .bodyToFlux(FeatureFlagResponseDTO.class)
                    .collectList()
                    .timeout(Duration.ofSeconds(5));

            List<FeatureFlagResponseDTO> flags = responseMono.block();

            if (flags != null) {
                logger.info("Successfully fetched {} feature flags", flags.size());
                flags.forEach(flag ->
                        logger.debug("Flag: {} = {}", flag.getName(), flag.getEnabled()));
            } else {
                logger.warn("Received null response when fetching feature flags");
            }

            return flags;

        } catch (WebClientException e) {
            logger.error("Error fetching feature flags from service", e);
            throw new FeatureFlagSyncException("Failed to sync feature flags: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error while fetching feature flags", e);
            throw new FeatureFlagSyncException("Unexpected error during flag sync", e);
        }
    }

    /**
     * Fetch a specific feature flag by name
     */
    public FeatureFlagResponseDTO getFlagByName(String flagName) {
        logger.debug("Fetching feature flag: {}", flagName);

        try {
            Mono<FeatureFlagResponseDTO> responseMono = webClient
                    .get()
                    .uri("/api/flags/name/{name}", flagName)
                    .retrieve()
                    .bodyToMono(FeatureFlagResponseDTO.class)
                    .timeout(Duration.ofSeconds(5));

            FeatureFlagResponseDTO flag = responseMono.block();

            if (flag != null) {
                logger.debug("Successfully fetched flag: {} = {}", flag.getName(), flag.getEnabled());
            }

            return flag;

        } catch (WebClientException e) {
            logger.warn("Error fetching flag '{}': {}", flagName, e.getMessage());
            return null; // Return null for missing flags instead of throwing exception
        } catch (Exception e) {
            logger.error("Unexpected error while fetching flag: {}", flagName, e);
            return null;
        }
    }

    /**
     * Health check for Feature Flag Service
     */
    public boolean isServiceHealthy() {
        try {
            logger.debug("Checking Feature Flag Service health");

            Mono<String> responseMono = webClient
                    .get()
                    .uri("/api/flags/health")
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(3));

            String response = responseMono.block();
            boolean healthy = response != null && response.contains("healthy");

            logger.debug("Feature Flag Service health check: {}", healthy ? "HEALTHY" : "UNHEALTHY");
            return healthy;

        } catch (Exception e) {
            logger.warn("Feature Flag Service health check failed", e);
            return false;
        }
    }

    /**
     * Custom exception for flag synchronization errors
     */
    public static class FeatureFlagSyncException extends RuntimeException {
        public FeatureFlagSyncException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
