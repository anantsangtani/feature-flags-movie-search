
package com.featureflags.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.featureflags.dto.FeatureFlagRequestDTO;
import com.featureflags.dto.FeatureFlagResponseDTO;
import com.featureflags.exception.ResourceNotFoundException;
import com.featureflags.service.FeatureFlagService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FeatureFlagController.class)
class FeatureFlagControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FeatureFlagService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllFlags_ShouldReturnListOfFlags() throws Exception {
        // Given
        FeatureFlagResponseDTO flag = createTestFlag();
        List<FeatureFlagResponseDTO> flags = Arrays.asList(flag);
        when(service.getAllFlags()).thenReturn(flags);

        // When & Then
        mockMvc.perform(get("/api/flags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("test_flag"));
    }

    @Test
    void getFlagById_WhenExists_ShouldReturnFlag() throws Exception {
        // Given
        FeatureFlagResponseDTO flag = createTestFlag();
        when(service.getFlagById(1L)).thenReturn(flag);

        // When & Then
        mockMvc.perform(get("/api/flags/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("test_flag"))
                .andExpect(jsonPath("$.enabled").value(true));
    }

    @Test
    void getFlagById_WhenNotExists_ShouldReturn404() throws Exception {
        // Given
        when(service.getFlagById(1L)).thenThrow(new ResourceNotFoundException("Flag not found"));

        // When & Then
        mockMvc.perform(get("/api/flags/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createFlag_WhenValid_ShouldReturnCreatedFlag() throws Exception {
        // Given
        FeatureFlagRequestDTO request = new FeatureFlagRequestDTO("new_flag", true, "New flag");
        FeatureFlagResponseDTO response = createTestFlag();
        when(service.createFlag(any(FeatureFlagRequestDTO.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/flags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("test_flag"));
    }

    @Test
    void createFlag_WhenInvalid_ShouldReturn400() throws Exception {
        // Given
        FeatureFlagRequestDTO request = new FeatureFlagRequestDTO("", null, "Invalid flag");

        // When & Then
        mockMvc.perform(post("/api/flags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void toggleFlag_ShouldReturnToggledFlag() throws Exception {
        // Given
        FeatureFlagResponseDTO flag = createTestFlag();
        flag.setEnabled(false);
        when(service.toggleFlag(1L)).thenReturn(flag);

        // When & Then
        mockMvc.perform(post("/api/flags/1/toggle"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled").value(false));
    }

    @Test
    void deleteFlag_ShouldReturnNoContent() throws Exception {
        // When & Then
        mockMvc.perform(delete("/api/flags/1"))
                .andExpect(status().isNoContent());
    }

    private FeatureFlagResponseDTO createTestFlag() {
        FeatureFlagResponseDTO flag = new FeatureFlagResponseDTO();
        flag.setId(1L);
        flag.setName("test_flag");
        flag.setEnabled(true);
        flag.setDescription("Test flag");
        flag.setCreatedAt(LocalDateTime.now());
        flag.setUpdatedAt(LocalDateTime.now());
        return flag;
    }
}
