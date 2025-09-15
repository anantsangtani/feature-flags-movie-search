package com.featureflags.service;

import com.featureflags.dto.FeatureFlagRequestDTO;
import com.featureflags.dto.FeatureFlagResponseDTO;
import com.featureflags.entity.FeatureFlag;
import com.featureflags.exception.ResourceNotFoundException;
import com.featureflags.exception.DuplicateResourceException;
import com.featureflags.repository.FeatureFlagRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeatureFlagServiceTest {

    @Mock
    private FeatureFlagRepository repository;

    @Mock
    private FlagChangeMessagingService messagingService;

    @InjectMocks
    private FeatureFlagService featureFlagService;

    private FeatureFlag testFlag;

    @BeforeEach
    void setUp() {
        testFlag = new FeatureFlag("dark_mode", true, "Dark mode toggle");
        testFlag.setId(1L);
        testFlag.setCreatedAt(LocalDateTime.now());
        testFlag.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void getAllFlags_ReturnsAllFlags() {
        // Given
        when(repository.findAll()).thenReturn(Arrays.asList(testFlag));

        // When
        List<FeatureFlagResponseDTO> result = featureFlagService.getAllFlags();

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("dark_mode");
        verify(repository).findAll();
    }

    @Test
    void getFlagById_ExistingFlag_ReturnsFlag() {
        // Given
        when(repository.findById(1L)).thenReturn(Optional.of(testFlag));

        // When
        FeatureFlagResponseDTO result = featureFlagService.getFlagById(1L);

        // Then
        assertThat(result.getName()).isEqualTo("dark_mode");
        assertThat(result.getEnabled()).isTrue();
    }

    @Test
    void getFlagById_NonExistingFlag_ThrowsException() {
        // Given
        when(repository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> featureFlagService.getFlagById(1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Feature flag not found with id: 1");
    }

    @Test
    void createFlag_ValidRequest_CreatesFlag() {
        // Given
        FeatureFlagRequestDTO request = new FeatureFlagRequestDTO("new_flag", true, "New flag");
        when(repository.existsByName("new_flag")).thenReturn(false);
        when(repository.save(any(FeatureFlag.class))).thenReturn(testFlag);

        // When
        FeatureFlagResponseDTO result = featureFlagService.createFlag(request);

        // Then
        assertThat(result).isNotNull();
        verify(repository).save(any(FeatureFlag.class));
        verify(messagingService).publishFlagCreated(anyString(), anyBoolean());
    }

    @Test
    void createFlag_DuplicateName_ThrowsException() {
        // Given
        FeatureFlagRequestDTO request = new FeatureFlagRequestDTO("existing_flag", true, "Existing");
        when(repository.existsByName("existing_flag")).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> featureFlagService.createFlag(request))
                .isInstanceOf(DuplicateResourceException.class);

        verify(repository, never()).save(any());
    }

    @Test
    void toggleFlag_ExistingFlag_TogglesSuccessfully() {
        // Given
        when(repository.findById(1L)).thenReturn(Optional.of(testFlag));
        when(repository.save(any(FeatureFlag.class))).thenReturn(testFlag);

        // When
        FeatureFlagResponseDTO result = featureFlagService.toggleFlag(1L);

        // Then
        assertThat(result).isNotNull();
        verify(repository).save(any(FeatureFlag.class));
        verify(messagingService).publishFlagUpdated(anyString(), anyBoolean());
    }

    @Test
    void deleteFlag_ExistingFlag_DeletesSuccessfully() {
        // Given
        when(repository.findById(1L)).thenReturn(Optional.of(testFlag));

        // When
        featureFlagService.deleteFlag(1L);

        // Then
        verify(repository).delete(testFlag);
        verify(messagingService).publishFlagDeleted("dark_mode");
    }
}
