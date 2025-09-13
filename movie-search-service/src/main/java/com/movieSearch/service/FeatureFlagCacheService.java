package com.movieSearch.service;

import com.movieSearch.dto.FlagChangeEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class FeatureFlagCacheService {

    private static final Logger logger = LoggerFactory.getLogger(FeatureFlagCacheService.class);

    // In-memory cache for feature flags
    private final Map<String, Boolean> flagCache = new ConcurrentHashMap<>();

    // Known flags that this service cares about
    private static final String DARK_MODE_FLAG = "dark_mode";
    private static final String MAINTENANCE_MODE_FLAG = "maintenance_mode";

    public FeatureFlagCacheService() {
        // Initialize with default values
        flagCache.put(DARK_MODE_FLAG, false);
        flagCache.put(MAINTENANCE_MODE_FLAG, false);
        logger.info("Initialized feature flag cache with default values");
    }

    /**
     * Check if a feature flag is enabled
     */
    public boolean isFlagEnabled(String flagName) {
        boolean enabled = flagCache.getOrDefault(flagName, false);
        logger.debug("Flag '{}' is {}", flagName, enabled ? "enabled" : "disabled");
        return enabled;
    }

    /**
     * Check if dark mode is enabled
     */
    public boolean isDarkModeEnabled() {
        return isFlagEnabled(DARK_MODE_FLAG);
    }

    /**
     * Check if maintenance mode is enabled
     */
    public boolean isMaintenanceModeEnabled() {
        return isFlagEnabled(MAINTENANCE_MODE_FLAG);
    }

    /**
     * Update flag cache when receiving flag change events
     */
    public void updateFlag(FlagChangeEvent event) {
        String flagName = event.getFlagName();

        if (isRelevantFlag(flagName)) {
            if ("DELETED".equals(event.getChangeType())) {
                flagCache.remove(flagName);
                logger.info("Removed flag '{}' from cache", flagName);
            } else {
                Boolean enabled = event.getEnabled();
                flagCache.put(flagName, enabled != null ? enabled : false);
                logger.info("Updated flag '{}' in cache to {}", flagName, enabled);
            }
        } else {
            logger.debug("Ignoring irrelevant flag update: {}", flagName);
        }
    }

    /**
     * Check if this service cares about the flag
     */
    private boolean isRelevantFlag(String flagName) {
        return DARK_MODE_FLAG.equals(flagName) || MAINTENANCE_MODE_FLAG.equals(flagName);
    }

    /**
     * Get all cached flags for debugging
     */
    public Map<String, Boolean> getAllFlags() {
        return Map.copyOf(flagCache);
    }

    /**
     * Clear all cached flags (for testing)
     */
    public void clearCache() {
        flagCache.clear();
        logger.info("Cleared feature flag cache");
    }

    /**
     * Get cache statistics
     */
    public CacheStats getStats() {
        return new CacheStats(
                flagCache.size(),
                (int) flagCache.values().stream().mapToInt(b -> b ? 1 : 0).sum(),
                flagCache.size() - (int) flagCache.values().stream().mapToInt(b -> b ? 1 : 0).sum()
        );
    }

    public static class CacheStats {
        private final int totalFlags;
        private final int enabledFlags;
        private final int disabledFlags;

        public CacheStats(int totalFlags, int enabledFlags, int disabledFlags) {
            this.totalFlags = totalFlags;
            this.enabledFlags = enabledFlags;
            this.disabledFlags = disabledFlags;
        }

        public int getTotalFlags() { return totalFlags; }
        public int getEnabledFlags() { return enabledFlags; }
        public int getDisabledFlags() { return disabledFlags; }
    }
}