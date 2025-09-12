package com.featureflags.dto;

import com.featureflags.entity.FeatureFlag;

import java.time.LocalDateTime;

public class FeatureFlagResponseDTO {

    private Long id;
    private String name;
    private Boolean enabled;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public FeatureFlagResponseDTO() {}

    public FeatureFlagResponseDTO(FeatureFlag featureFlag) {
        this.id = featureFlag.getId();
        this.name = featureFlag.getName();
        this.enabled = featureFlag.getEnabled();
        this.description = featureFlag.getDescription();
        this.createdAt = featureFlag.getCreatedAt();
        this.updatedAt = featureFlag.getUpdatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
