package com.featureflags.service;

import com.featureflags.config.RedisConfig;
import com.featureflags.dto.FlagChangeEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class FlagChangeMessagingService {

    private static final Logger logger = LoggerFactory.getLogger(FlagChangeMessagingService.class);

    private final RedisTemplate<String, Object> redisTemplate;

    @Autowired
    public FlagChangeMessagingService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Publish a flag change event to Redis
     */
    public void publishFlagChange(String flagName, Boolean enabled, String changeType) {
        try {
            FlagChangeEvent event = new FlagChangeEvent(flagName, enabled, changeType);

            logger.info("Publishing flag change event: {} - {} - {}",
                    flagName, enabled, changeType);

            redisTemplate.convertAndSend(RedisConfig.FEATURE_FLAGS_CHANNEL, event);

            logger.debug("Successfully published flag change event for flag: {}", flagName);

        } catch (Exception e) {
            logger.error("Failed to publish flag change event for flag: {}", flagName, e);
            // Don't throw exception - messaging failure shouldn't break the main operation
        }
    }

    /**
     * Publish flag creation event
     */
    public void publishFlagCreated(String flagName, Boolean enabled) {
        publishFlagChange(flagName, enabled, "CREATED");
    }

    /**
     * Publish flag update event
     */
    public void publishFlagUpdated(String flagName, Boolean enabled) {
        publishFlagChange(flagName, enabled, "UPDATED");
    }

    /**
     * Publish flag deletion event
     */
    public void publishFlagDeleted(String flagName) {
        publishFlagChange(flagName, false, "DELETED");
    }
}