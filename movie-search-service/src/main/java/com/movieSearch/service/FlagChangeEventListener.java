package com.movieSearch.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.movieSearch.dto.FlagChangeEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Component
public class FlagChangeEventListener implements MessageListener {

    private static final Logger logger = LoggerFactory.getLogger(FlagChangeEventListener.class);

    private final FeatureFlagCacheService flagCacheService;
    private final ObjectMapper objectMapper;

    @Autowired
    public FlagChangeEventListener(FeatureFlagCacheService flagCacheService, ObjectMapper objectMapper) {
        this.flagCacheService = flagCacheService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String messageBody = new String(message.getBody());
            String channel = new String(message.getChannel());

            logger.info("Received message on channel '{}': {}", channel, messageBody);

            // Parse the flag change event
            FlagChangeEvent event = objectMapper.readValue(messageBody, FlagChangeEvent.class);

            // Update the local cache
            flagCacheService.updateFlag(event);

            logger.info("Successfully processed flag change event for flag: {}", event.getFlagName());

        } catch (JsonProcessingException e) {
            logger.error("Failed to parse flag change event message: {}", new String(message.getBody()), e);
        } catch (Exception e) {
            logger.error("Error processing flag change event", e);
        }
    }
}
