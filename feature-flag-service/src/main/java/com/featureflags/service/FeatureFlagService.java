package com.featureflags.service;

import com.featureflags.dto.FeatureFlagRequestDTO;
import com.featureflags.dto.FeatureFlagResponseDTO;
import com.featureflags.entity.FeatureFlag;
import com.featureflags.exception.ResourceNotFoundException;
import com.featureflags.exception.DuplicateResourceException;
import com.featureflags.repository.FeatureFlagRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FeatureFlagService {

    private static final Logger logger = LoggerFactory.getLogger(FeatureFlagService.class);

    private final FeatureFlagRepository repository;
    private final FlagChangeMessagingService messagingService;

    @Autowired
    public FeatureFlagService(FeatureFlagRepository repository,
                              FlagChangeMessagingService messagingService) {
        this.repository = repository;
        this.messagingService = messagingService;
    }

    /**
     * Get all feature flags
     */
    @Transactional(readOnly = true)
    public List<FeatureFlagResponseDTO> getAllFlags() {
        logger.debug("Fetching all feature flags");
        return repository.findAll().stream()
                .map(FeatureFlagResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific feature flag by ID
     */
    @Transactional(readOnly = true)
    public FeatureFlagResponseDTO getFlagById(Long id) {
        logger.debug("Fetching feature flag with id: {}", id);
        FeatureFlag flag = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feature flag not found with id: " + id));
        return new FeatureFlagResponseDTO(flag);
    }

    /**
     * Get a specific feature flag by name
     */
    @Transactional(readOnly = true)
    public FeatureFlagResponseDTO getFlagByName(String name) {
        logger.debug("Fetching feature flag with name: {}", name);
        FeatureFlag flag = repository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Feature flag not found with name: " + name));
        return new FeatureFlagResponseDTO(flag);
    }

    /**
     * Create a new feature flag
     */
    public FeatureFlagResponseDTO createFlag(FeatureFlagRequestDTO request) {
        logger.info("Creating new feature flag: {}", request.getName());

        // Check if flag already exists
        if (repository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Feature flag already exists with name: " + request.getName());
        }

        // Create and save the flag
        FeatureFlag flag = new FeatureFlag(
                request.getName(),
                request.getEnabled(),
                request.getDescription()
        );

        FeatureFlag savedFlag = repository.save(flag);
        logger.info("Created feature flag: {} with id: {}", savedFlag.getName(), savedFlag.getId());

        // Publish creation event
        messagingService.publishFlagCreated(savedFlag.getName(), savedFlag.getEnabled());

        return new FeatureFlagResponseDTO(savedFlag);
    }

    /**
     * Update an existing feature flag
     */
    public FeatureFlagResponseDTO updateFlag(Long id, FeatureFlagRequestDTO request) {
        logger.info("Updating feature flag with id: {}", id);

        FeatureFlag existingFlag = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feature flag not found with id: " + id));

        // Check if name is being changed and if new name already exists
        if (!existingFlag.getName().equals(request.getName()) &&
                repository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Feature flag already exists with name: " + request.getName());
        }

        // Store old values for comparison
        boolean enabledChanged = !existingFlag.getEnabled().equals(request.getEnabled());
        String oldName = existingFlag.getName();

        // Update the flag
        existingFlag.setName(request.getName());
        existingFlag.setEnabled(request.getEnabled());
        existingFlag.setDescription(request.getDescription());

        FeatureFlag updatedFlag = repository.save(existingFlag);
        logger.info("Updated feature flag: {}", updatedFlag.getName());

        // Publish update event (use new name if changed)
        messagingService.publishFlagUpdated(updatedFlag.getName(), updatedFlag.getEnabled());

        // If name changed, also publish deletion event for old name
        if (!oldName.equals(updatedFlag.getName())) {
            messagingService.publishFlagDeleted(oldName);
        }

        return new FeatureFlagResponseDTO(updatedFlag);
    }

    /**
     * Delete a feature flag
     */
    public void deleteFlag(Long id) {
        logger.info("Deleting feature flag with id: {}", id);

        FeatureFlag flag = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feature flag not found with id: " + id));

        String flagName = flag.getName();
        repository.delete(flag);
        logger.info("Deleted feature flag: {}", flagName);

        // Publish deletion event
        messagingService.publishFlagDeleted(flagName);
    }

    /**
     * Toggle a feature flag's enabled status
     */
    public FeatureFlagResponseDTO toggleFlag(Long id) {
        logger.info("Toggling feature flag with id: {}", id);

        FeatureFlag flag = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feature flag not found with id: " + id));

        flag.setEnabled(!flag.getEnabled());
        FeatureFlag updatedFlag = repository.save(flag);
        logger.info("Toggled feature flag: {} to {}", updatedFlag.getName(), updatedFlag.getEnabled());

        // Publish update event
        messagingService.publishFlagUpdated(updatedFlag.getName(), updatedFlag.getEnabled());

        return new FeatureFlagResponseDTO(updatedFlag);
    }

    /**
     * Get statistics about feature flags
     */
    @Transactional(readOnly = true)
    public FeatureFlagStatsDTO getStats() {
        logger.debug("Fetching feature flag statistics");
        long totalFlags = repository.count();
        long enabledFlags = repository.countEnabledFlags();
        return new FeatureFlagStatsDTO(totalFlags, enabledFlags, totalFlags - enabledFlags);
    }
}

// Stats DTO for dashboard
class FeatureFlagStatsDTO {
    private long totalFlags;
    private long enabledFlags;
    private long disabledFlags;

    public FeatureFlagStatsDTO(long totalFlags, long enabledFlags, long disabledFlags) {
        this.totalFlags = totalFlags;
        this.enabledFlags = enabledFlags;
        this.disabledFlags = disabledFlags;
    }

    // Getters
    public long getTotalFlags() { return totalFlags; }
    public long getEnabledFlags() { return enabledFlags; }
    public long getDisabledFlags() { return disabledFlags; }
}