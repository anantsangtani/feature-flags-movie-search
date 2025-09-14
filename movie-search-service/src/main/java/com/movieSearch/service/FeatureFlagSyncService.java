package com.movieSearch.service;

import com.movieSearch.dto.FlagChangeEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class FeatureFlagSyncService {

    private static final Logger logger = LoggerFactory.getLogger(FeatureFlagSyncService.class);

    @Value("${feature-flag.service.url:http://feature-flag-service:8080}")
    private String featureFlagServiceUrl;

    private final FeatureFlagCacheService flagCacheService;
    private final RestTemplate restTemplate;

    @Autowired
    public FeatureFlagSyncService(FeatureFlagCacheService flagCacheService, RestTemplate restTemplate) {
        this.flagCacheService = flagCacheService;
        this.restTemplate = restTemplate;
    }

    /**
     * Sync with Feature Flag Service on application startup
     */
    @EventListener(ApplicationReadyEvent.class)
    @Async
    public void syncOnStartup() {
        logger.info("Starting feature flag synchronization on application startup");
        syncWithFeatureFlagService();
    }

    /**
     * Sync with Feature Flag Service manually
     */
    public void syncWithFeatureFlagService() {
        try {
            logger.info("Attempting to sync with Feature Flag Service at: {}", featureFlagServiceUrl);

            String url = featureFlagServiceUrl + "/api/flags";
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> flags = response.getBody();
                logger.info("Successfully retrieved {} flags from Feature Flag Service", flags.size());

                // Clear existing cache and update with current flags
                flagCacheService.clearCache();

                for (Map<String, Object> flagData : flags) {
                    String flagName = (String) flagData.get("name");
                    Boolean enabled = (Boolean) flagData.get("enabled");

                    if (flagName != null && enabled != null) {
                        // Create a flag change event to update the cache
                        FlagChangeEvent event = new FlagChangeEvent(flagName, enabled, "UPDATED");
                        flagCacheService.updateFlag(event);
                        logger.debug("Synced flag: {} = {}", flagName, enabled);
                    }
                }

                logger.info("Feature flag synchronization completed successfully");
            } else {
                logger.warn("Failed to sync flags - received response code: {}", response.getStatusCode());
            }

        } catch (Exception e) {
            logger.error("Failed to sync with Feature Flag Service. Service may not be available yet.", e);
            // Don't throw exception - allow service to start with default flag values
            // The Redis listener will update flags when they become available
        }
    }

    /**
     * Get the configured Feature Flag Service URL
     */
    public String getFeatureFlagServiceUrl() {
        return featureFlagServiceUrl;
    }
}
