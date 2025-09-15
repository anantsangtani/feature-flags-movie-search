package com.movieSearch.service;

import com.movieSearch.client.OMDBClient;
import com.movieSearch.dto.MovieSearchResponseDTO;
import com.movieSearch.exception.MaintenanceModeException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovieSearchServiceTest {

    @Mock
    private OMDBClient omdbClient;

    @Mock
    private FeatureFlagCacheService flagCacheService;

    @Mock
    private FeatureFlagSyncService syncService;

    @InjectMocks
    private MovieSearchService movieSearchService;

    private MovieSearchResponseDTO mockResponse;

    @BeforeEach
    void setUp() {
        mockResponse = new MovieSearchResponseDTO();
        mockResponse.setResponse("True");
        mockResponse.setTotalResults("1");
    }

    @Test
    void searchMovies_MaintenanceDisabled_ReturnsResults() {
        // Given
        when(flagCacheService.isMaintenanceModeEnabled()).thenReturn(false);
        when(omdbClient.searchMovies("test", 1, null)).thenReturn(mockResponse);

        // When
        MovieSearchResponseDTO result = movieSearchService.searchMovies("test");

        // Then
        assertThat(result.getResponse()).isEqualTo("True");
        verify(omdbClient).searchMovies("test", 1, null);
    }

    @Test
    void searchMovies_MaintenanceEnabled_ThrowsException() {
        // Given
        when(flagCacheService.isMaintenanceModeEnabled()).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> movieSearchService.searchMovies("test"))
                .isInstanceOf(MaintenanceModeException.class);

        verify(omdbClient, never()).searchMovies(anyString(), anyInt(), any());
    }

    @Test
    void searchMovies_EmptyTitle_ThrowsException() {
        // When & Then
        assertThatThrownBy(() -> movieSearchService.searchMovies(""))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Movie title cannot be empty");
    }

    @Test
    void getHealthStatus_ReturnsHealthInfo() {
        // Given
        when(flagCacheService.isMaintenanceModeEnabled()).thenReturn(false);
        when(omdbClient.isApiHealthy()).thenReturn(true);

        // When
        MovieSearchService.ServiceHealthDTO result = movieSearchService.getHealthStatus();

        // Then
        assertThat(result.getStatus()).isEqualTo("UP");
        assertThat(result.isMaintenanceMode()).isFalse();
        assertThat(result.isOmdbApiHealthy()).isTrue();
    }
}
