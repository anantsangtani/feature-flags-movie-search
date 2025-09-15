package com.featureflags.service;

import com.featureflags.config.RedisConfig;
import com.featureflags.dto.FlagChangeEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class FlagChangeMessagingServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @InjectMocks
    private FlagChangeMessagingService messagingService;

    @Test
    void publishFlagCreated_CallsRedisTemplate() {
        // When
        messagingService.publishFlagCreated("test_flag", true);

        // Then
        verify(redisTemplate).convertAndSend(
                eq(RedisConfig.FEATURE_FLAGS_CHANNEL),
                any(FlagChangeEvent.class)
        );
    }

    @Test
    void publishFlagUpdated_CallsRedisTemplate() {
        // When
        messagingService.publishFlagUpdated("test_flag", false);

        // Then
        verify(redisTemplate).convertAndSend(
                eq(RedisConfig.FEATURE_FLAGS_CHANNEL),
                any(FlagChangeEvent.class)
        );
    }

    @Test
    void publishFlagDeleted_CallsRedisTemplate() {
        // When
        messagingService.publishFlagDeleted("test_flag");

        // Then
        verify(redisTemplate).convertAndSend(
                eq(RedisConfig.FEATURE_FLAGS_CHANNEL),
                any(FlagChangeEvent.class)
        );
    }
}
