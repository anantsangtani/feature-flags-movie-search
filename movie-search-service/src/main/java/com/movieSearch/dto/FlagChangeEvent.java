package com.movieSearch.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class FlagChangeEvent {

    @JsonProperty("flagName")
    private String flagName;

    @JsonProperty("enabled")
    private Boolean enabled;

    @JsonProperty("changeType")
    private String changeType;

    public FlagChangeEvent() {}

    public FlagChangeEvent(String flagName, Boolean enabled, String changeType) {
        this.flagName = flagName;
        this.enabled = enabled;
        this.changeType = changeType;
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

    public String getChangeType() {
        return changeType;
    }

    public void setChangeType(String changeType) {
        this.changeType = changeType;
    }

    @Override
    public String toString() {
        return "FlagChangeEvent{" +
                "flagName='" + flagName + '\'' +
                ", enabled=" + enabled +
                ", changeType='" + changeType + '\'' +
                '}';
    }
}
