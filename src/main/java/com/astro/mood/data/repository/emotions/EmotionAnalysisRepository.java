package com.astro.mood.data.repository.emotions;

import com.astro.mood.data.entity.diary.DiaryEmotion;
import com.astro.mood.data.entity.emotion.EmotionAnalysis;
import com.astro.mood.data.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmotionAnalysisRepository extends JpaRepository<EmotionAnalysis, Integer> {

    // Diary의 createdAt을 기준으로 diaryEmotion데이터를 가져오는 쿼리 (diaryEmotion은 수정한 날짜로 createdAt이 분석 오류가 생김)
    @Query("SELECT de FROM DiaryEmotion de " +
            "JOIN de.diary d " +
            "WHERE d.user = :user AND d.createdAt BETWEEN :startDate AND :endDate")
    List<DiaryEmotion> findByDiaryCreatedAtForDiaryEmotion(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}