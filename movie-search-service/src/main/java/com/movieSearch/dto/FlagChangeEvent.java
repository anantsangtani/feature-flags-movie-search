package com.movieSearch.dto;

import java.time.LocalDateTime;

public class FlagChangeEvent {

    private String flagName;
    private Boolean enabled;
    private LocalDateTime timestamp;
    private String changeType;

    // Constructors
    public FlagChangeEvent() {}

    public FlagChangeEvent(String flagName, Boolean enabled, String changeType) {
        this.flagName = flagName;
        this.enabled = enabled;
        this.changeType = changeType;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getFlagName() {
        return flagName;
    }

    public void setFlagName(String flagName) {
        this.flagName = flagName;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getChangeType() {
        return changeType;
    }

    public void setChangeType(String changeType) {
        this.changeType = changeType;
    }
}
