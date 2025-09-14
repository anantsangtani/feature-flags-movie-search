package com.featureflags.service;

import com.featureflags.dto.FeatureFlagRequestDTO;
import com.featureflags.dto.FeatureFlagResponseDTO;
import com.featureflags.entity.FeatureFlag;
import com.featureflags.exception.DuplicateResourceException;
import com.featureflags.exception.ResourceNotFoundException;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeatureFlagServiceTest {

    @Mock
    private FeatureFlagRepository repository;

    @Mock
    private FlagChangeMessagingService messagingService;

    @InjectMocks
    private FeatureFlagService service;

    private FeatureFlag testFlag;
    private FeatureFlagRequestDTO testRequest;

    @BeforeEach
    void setUp() {
        testFlag = new FeatureFlag("test_flag", true, "Test description");
        testFlag.setId(1L);
        testFlag.setCreatedAt(LocalDateTime.now());
        testFlag.setUpdatedAt(LocalDateTime.now());

        testRequest = new FeatureFlagRequestDTO("test_flag", true, "Test description");
    }

    @Test
    void getAllFlags_ShouldReturnListOfFlags() {
        // Given
        List<FeatureFlag> flags = Arrays.asList(testFlag);
        when(repository.findAll()).thenReturn(flags);

        // When
        List<FeatureFlagResponseDTO> result = service.getAllFlags();

        // Then
        assertEquals(1, result.size());
        assertEquals("test_flag", result.get(0).getName());
        verify(repository).findAll();
    }

    @Test
    void getFlagById_WhenExists_ShouldReturnFlag() {
        // Given
        when(repository.findById(1L)).thenReturn(Optional.of(testFlag));

        // When
        FeatureFlagResponseDTO result = service.getFlagById(1L);

        // Then
        assertEquals("test_flag", result.getName());
        assertEquals(true, result.getEnabled());
        verify(repository).findById(1L);
    }

    @Test
    void getFlagById_WhenNotExists_ShouldThrowException() {
        // Given
        when(repository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> service.getFlagById(1L));
        verify(repository).findById(1L);
    }

    @Test
    void createFlag_WhenValid_ShouldCreateAndPublishEvent() {
        // Given
        when(repository.existsByName("test_flag")).thenReturn(false);
        when(repository.save(any(FeatureFlag.class))).thenReturn(testFlag);

        // When
        FeatureFlagResponseDTO result = service.createFlag(testRequest);

        // Then
        assertEquals("test_flag", result.getName());
        verify(repository).existsByName("test_flag");
        verify(repository).save(any(FeatureFlag.class));
        verify(messagingService).publishFlagCreated("test_flag", true);
    }

    @Test
    void createFlag_WhenDuplicate_ShouldThrowException() {
        // Given
        when(repository.existsByName("test_flag")).thenReturn(true);

        // When & Then
        assertThrows(DuplicateResourceException.class, () -> service.createFlag(testRequest));
        verify(repository).existsByName("test_flag");
        verify(repository, never()).save(any());
        verify(messagingService, never()).publishFlagCreated(anyString(), any());
    }

    @Test
    void updateFlag_WhenValid_ShouldUpdateAndPublishEvent() {
        // Given
        FeatureFlagRequestDTO updateRequest = new FeatureFlagRequestDTO("updated_flag", false, "Updated description");
        when(repository.findById(1L)).thenReturn(Optional.of(testFlag));
        when(repository.existsByName("updated_flag")).thenReturn(false);
        when(repository.save(any(FeatureFlag.class))).thenReturn(testFlag);

        // When
        FeatureFlagResponseDTO result = service.updateFlag(1L, updateRequest);

        // Then
        verify(repository).findById(1L);
        verify(repository).save(any(FeatureFlag.class));
        verify(messagingService).publishFlagUpdated(anyString(), any());
    }

    @Test
    void deleteFlag_WhenExists_ShouldDeleteAndPublishEvent() {
        // Given
        when(repository.findById(1L)).thenReturn(Optional.of(testFlag));
        doNothing().when(repository).delete(testFlag);

        // When
        service.deleteFlag(1L);

        // Then
        verify(repository).findById(1L);
        verify(repository).delete(testFlag);
        verify(messagingService).publishFlagDeleted("test_flag");
    }

    @Test
    void toggleFlag_ShouldToggleEnabledStatus() {
        // Given
        when(repository.findById(1L)).thenReturn(Optional.of(testFlag));
        when(repository.save(any(FeatureFlag.class))).thenReturn(testFlag);

        // When
        FeatureFlagResponseDTO result = service.toggleFlag(1L);

        // Then
        verify(repository).findById(1L);
        verify(repository).save(any(FeatureFlag.class));
        verify(messagingService).publishFlagUpdated("test_flag", any());
    }
}
