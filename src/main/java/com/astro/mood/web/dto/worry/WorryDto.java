package com.astro.mood.web.dto.worry;

import com.astro.mood.data.entity.worry.Worry;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class WorryDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String title;
        private String content;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Integer worryIdx;
        private String title;
        private String content;
        private int viewCount;
        private Boolean isResolved;
        private LocalDateTime createdAt;
        private LocalDateTime resolvedAt;

        public static Response fromEntity(Worry worry) {
            return Response.builder()
                    .worryIdx(worry.getWorryIdx())
                    .title(worry.getTitle())
                    .content(worry.getContent())
                    .viewCount(worry.getViewCount())
                    .isResolved(worry.getIsResolved())
                    .createdAt(worry.getCreatedAt())
                    .resolvedAt(worry.getResolvedAt())
                    .build();
        }
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String title;
        private String content;
        private Boolean isResolved;
    }
    //resolve 처리
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResolveChangeRequest {
        private Boolean isResolved;
    }
}
