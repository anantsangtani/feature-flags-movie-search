package com.featureflags.repository;

import com.featureflags.entity.FeatureFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeatureFlagRepository extends JpaRepository<FeatureFlag, Long> {

    /**
     * Find a feature flag by its name
     */
    Optional<FeatureFlag> findByName(String name);

    /**
     * Check if a feature flag exists by name
     */
    boolean existsByName(String name);

    /**
     * Find a feature flag by name and return only if it's enabled
     */
    @Query("SELECT f FROM FeatureFlag f WHERE f.name = :name AND f.enabled = true")
    Optional<FeatureFlag> findByNameAndEnabled(String name);

    /**
     * Count total number of enabled flags
     */
    @Query("SELECT COUNT(f) FROM FeatureFlag f WHERE f.enabled = true")
    Long countEnabledFlags();
}