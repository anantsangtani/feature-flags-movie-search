package com.movieSearch.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.movieSearch.dto.FlagChangeEvent;
import com.movieSearch.service.FeatureFlagCacheService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    private static final Logger logger = LoggerFactory.getLogger(RedisConfig.class);
    private static final String FEATURE_FLAGS_CHANNEL = "feature-flags-updates";

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // Configure JSON serialization
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        Jackson2JsonRedisSerializer<Object> serializer = new Jackson2JsonRedisSerializer<>(objectMapper, Object.class);

        // Set serializers
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);

        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory,
            MessageListenerAdapter flagChangeListenerAdapter) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);

        // Subscribe to feature flag updates channel
        container.addMessageListener(flagChangeListenerAdapter, new PatternTopic(FEATURE_FLAGS_CHANNEL));

        logger.info("Redis message listener container configured to listen on channel: {}", FEATURE_FLAGS_CHANNEL);
        return container;
    }

    @Bean
    public MessageListenerAdapter flagChangeListenerAdapter(FlagChangeListener flagChangeListener) {
        MessageListenerAdapter adapter = new MessageListenerAdapter(flagChangeListener, "handleFlagChange");

        // Configure JSON deserialization for the message
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        Jackson2JsonRedisSerializer<FlagChangeEvent> serializer =
                new Jackson2JsonRedisSerializer<>(objectMapper, FlagChangeEvent.class);

        adapter.setSerializer(serializer);
        return adapter;
    }

    @Bean
    public FlagChangeListener flagChangeListener(FeatureFlagCacheService flagCacheService) {
        return new FlagChangeListener(flagCacheService);
    }

    /**
     * Redis message listener for feature flag changes
     */
    public static class FlagChangeListener {

        private static final Logger logger = LoggerFactory.getLogger(FlagChangeListener.class);

        private final FeatureFlagCacheService flagCacheService;

        @Autowired
        public FlagChangeListener(FeatureFlagCacheService flagCacheService) {
            this.flagCacheService = flagCacheService;
        }

        /**
         * Handle incoming flag change messages
         */
        public void handleFlagChange(FlagChangeEvent event) {
            try {
                logger.debug("Received flag change event: {}", event);

                logger.info("Processing flag change event: {} - {} - {}",
                        event.getFlagName(), event.getEnabled(), event.getChangeType());

                // Update the flag cache
                flagCacheService.updateFlag(event);

            } catch (Exception e) {
                logger.error("Error processing flag change event: {}", event, e);
            }
        }
    }
}