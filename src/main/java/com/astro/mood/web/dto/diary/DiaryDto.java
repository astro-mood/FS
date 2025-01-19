package com.astro.mood.web.dto.diary;

import com.astro.mood.data.entity.diary.Diary;
import com.astro.mood.data.entity.diary.DiaryEmotion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class DiaryDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String title;
        private String content;

        // 여러 감정을 담는 리스트
        private List<EmotionData> emotions;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class EmotionData {
            private Integer emotionIdx;
            private int userScore;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        // 일기 작성
        private Integer diaryIdx;
        private String title;
        private String content;
        private LocalDate createdAt;
        private Integer userIdx;

        // 감정 여러개 선택-> List 형식
        private List<DiaryEmotionResponse> emotions;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class DiaryEmotionResponse {
            private Integer emotionIdx;
            private String description;
            private String emoji;
            private int userScore;
        }


        // 일기는 1개 + 감정 최대 7개까지 / 감정정보 필수
        public static Response fromEntity(Diary diary, List<DiaryEmotion> diaryEmotions) {
            if (diaryEmotions == null || diaryEmotions.isEmpty()) {
                throw new RuntimeException("감정 정보가 누락되었습니다.");
            }

            List<DiaryEmotionResponse> emotionList = diaryEmotions.stream()
                    .map(de -> new DiaryEmotionResponse(
                            de.getEmotions() != null ? de.getEmotions().getEmotionIdx() : null,
                            de.getEmotions() != null ? de.getEmotions().getDescription() : null,
                            de.getEmotions() != null ? de.getEmotions().getEmoji() : null,
                            de.getUserScore()
                    ))
                    .collect(Collectors.toList());

            return Response.builder()
                    .diaryIdx(diary.getDiaryIdx())
                    .title(diary.getTitle())
                    .content(diary.getContent())
                    .createdAt(diary.getCreatedAt().toLocalDate())
                    .userIdx(diary.getUser() != null ? diary.getUser().getUserIdx() : null)
                    .emotions(emotionList)
                    .build();
        }
    }
    // 일기 달력 조회
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CalendarResponse {
        private Integer diaryIdx;
        private LocalDate date;
        private List<CalendarEmotion> emotions;
    }
    // 일기 감정 조회
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CalendarEmotion {
        private Integer emotionIdx;
        private String emoji;
        private int userScore;
    }
    // 일기 수정
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String title;
        private String content;
        private String emoji;
        private List<EmotionData> emotions;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class EmotionData {
            private Integer emotionIdx;
            private int userScore;
        }
    }
}