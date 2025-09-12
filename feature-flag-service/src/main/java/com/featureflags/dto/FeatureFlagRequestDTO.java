package com.featureflags.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class FeatureFlagRequestDTO {

    @NotBlank(message = "Flag name is required")
    private String name;

    @NotNull(message = "Enabled status is required")
    private Boolean enabled;

    private String description;

    // Constructors
    public FeatureFlagRequestDTO() {}

    public FeatureFlagRequestDTO(String name, Boolean enabled, String description) {
        this.name = name;
        this.enabled = enabled;
        this.description = description;
    }

    // Getters and Setters
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
}
