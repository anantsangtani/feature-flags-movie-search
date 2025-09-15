package com.movieSearch.service;

import com.movieSearch.dto.FlagChangeEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class FeatureFlagCacheServiceTest {

    private FeatureFlagCacheService cacheService;

    @BeforeEach
    void setUp() {
        cacheService = new FeatureFlagCacheService();
    }

    @Test
    void initialState_AllFlagsDisabled() {
        // Then
        assertThat(cacheService.isDarkModeEnabled()).isFalse();
        assertThat(cacheService.isMaintenanceModeEnabled()).isFalse();
    }

    @Test
    void updateFlag_DarkMode_UpdatesCorrectly() {
        // Given
        FlagChangeEvent event = new FlagChangeEvent("dark_mode", true, "UPDATED");

        // When
        cacheService.updateFlag(event);

        // Then
        assertThat(cacheService.isDarkModeEnabled()).isTrue();
    }

    @Test
    void updateFlag_MaintenanceMode_UpdatesCorrectly() {
        // Given
        FlagChangeEvent event = new FlagChangeEvent("maintenance_mode", true, "UPDATED");

        // When
        cacheService.updateFlag(event);

        // Then
        assertThat(cacheService.isMaintenanceModeEnabled()).isTrue();
    }

    @Test
    void clearCache_ResetsAllFlags() {
        // Given
        cacheService.updateFlag(new FlagChangeEvent("dark_mode", true, "UPDATED"));
        cacheService.updateFlag(new FlagChangeEvent("maintenance_mode", true, "UPDATED"));

        // When
        cacheService.clearCache();

        // Then
        assertThat(cacheService.isDarkModeEnabled()).isFalse();
        assertThat(cacheService.isMaintenanceModeEnabled()).isFalse();
    }
}
