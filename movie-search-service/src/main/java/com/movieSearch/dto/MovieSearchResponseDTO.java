
package com.movieSearch.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class MovieSearchResponseDTO {

    @JsonProperty("Search")
    private List<MovieResponseDTO> search;

    @JsonProperty("totalResults")
    private String totalResults;

    @JsonProperty("Response")
    private String response;

    @JsonProperty("Error")
    private String error;

    // Constructors
    public MovieSearchResponseDTO() {}

    // Getters and Setters
    public List<MovieResponseDTO> getSearch() {
        return search;
    }

    public void setSearch(List<MovieResponseDTO> search) {
        this.search = search;
    }

    public String getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(String totalResults) {
        this.totalResults = totalResults;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}