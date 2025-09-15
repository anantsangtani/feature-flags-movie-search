package com.featureflags.dto;

// Stats DTO for dashboard
public class FeatureFlagStatsDTO {
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
