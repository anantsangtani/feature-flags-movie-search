package com.featureflags.controller;

import com.featureflags.dto.FeatureFlagRequestDTO;
import com.featureflags.dto.FeatureFlagResponseDTO;
import com.featureflags.service.FeatureFlagService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flags")
@CrossOrigin(origins = "*") // For development - configure properly for production
public class FeatureFlagController {

    private static final Logger logger = LoggerFactory.getLogger(FeatureFlagController.class);

    private final FeatureFlagService service;

    @Autowired
    public FeatureFlagController(FeatureFlagService service) {
        this.service = service;
    }

    /**
     * Get all feature flags
     */
    @GetMapping
    public ResponseEntity<List<FeatureFlagResponseDTO>> getAllFlags() {
        logger.debug("GET /api/flags - Fetching all feature flags");
        List<FeatureFlagResponseDTO> flags = service.getAllFlags();
        return ResponseEntity.ok(flags);
    }

    /**
     * Get a specific feature flag by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<FeatureFlagResponseDTO> getFlagById(@PathVariable Long id) {
        logger.debug("GET /api/flags/{} - Fetching feature flag by ID", id);
        FeatureFlagResponseDTO flag = service.getFlagById(id);
        return ResponseEntity.ok(flag);
    }

    /**
     * Get a specific feature flag by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<FeatureFlagResponseDTO> getFlagByName(@PathVariable String name) {
        logger.debug("GET /api/flags/name/{} - Fetching feature flag by name", name);
        FeatureFlagResponseDTO flag = service.getFlagByName(name);
        return ResponseEntity.ok(flag);
    }

    /**
     * Create a new feature flag
     */
    @PostMapping
    public ResponseEntity<FeatureFlagResponseDTO> createFlag(@Valid @RequestBody FeatureFlagRequestDTO request) {
        logger.info("POST /api/flags - Creating new feature flag: {}", request.getName());
        FeatureFlagResponseDTO createdFlag = service.createFlag(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdFlag);
    }

    /**
     * Update an existing feature flag
     */
    @PutMapping("/{id}")
    public ResponseEntity<FeatureFlagResponseDTO> updateFlag(
            @PathVariable Long id,
            @Valid @RequestBody FeatureFlagRequestDTO request) {
        logger.info("PUT /api/flags/{} - Updating feature flag", id);
        FeatureFlagResponseDTO updatedFlag = service.updateFlag(id, request);
        return ResponseEntity.ok(updatedFlag);
    }

    /**
     * Delete a feature flag
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlag(@PathVariable Long id) {
        logger.info("DELETE /api/flags/{} - Deleting feature flag", id);
        service.deleteFlag(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Toggle a feature flag's enabled status
     */
    @PostMapping("/{id}/toggle")
    public ResponseEntity<FeatureFlagResponseDTO> toggleFlag(@PathVariable Long id) {
        logger.info("POST /api/flags/{}/toggle - Toggling feature flag", id);
        FeatureFlagResponseDTO toggledFlag = service.toggleFlag(id);
        return ResponseEntity.ok(toggledFlag);
    }

    /**
     * Get feature flag statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        logger.debug("GET /api/flags/stats - Fetching feature flag statistics");
        var stats = service.getStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Feature Flag Service is healthy");
    }
}