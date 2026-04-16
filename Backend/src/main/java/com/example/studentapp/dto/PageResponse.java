package com.example.studentapp.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Generic pagination response wrapper for all list endpoints.
 * Contains paginated data along with pagination metadata.
 *
 * @param <T> Type of paginated content
 */
public record PageResponse<T>(
    @JsonProperty("content") List<T> content,
    @JsonProperty("page") int page,
    @JsonProperty("size") int size,
    @JsonProperty("totalElements") long totalElements,
    @JsonProperty("totalPages") int totalPages,
    @JsonProperty("isLast") boolean isLast,
    @JsonProperty("isEmpty") boolean isEmpty
) {
    /**
     * Create a PageResponse from paginated data.
     *
     * @param content list of paginated items
     * @param page current page number (0-indexed)
     * @param size page size
     * @param totalElements total number of elements
     * @return PageResponse instance
     */
    public static <T> PageResponse<T> of(List<T> content, int page, int size, long totalElements) {
        int totalPages = (int) Math.ceil((double) totalElements / size);
        boolean isLast = page >= totalPages - 1;
        boolean isEmpty = content.isEmpty();
        return new PageResponse<>(content, page, size, totalElements, totalPages, isLast, isEmpty);
    }
}
