package com.astro.mood.data.repository.emotions;

import com.astro.mood.data.entity.diary.DiaryEmotion;
import com.astro.mood.data.entity.emotion.EmotionAnalysis;
import com.astro.mood.data.entity.emotion.Emotions;
import com.astro.mood.data.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmotionAnalysisRepository extends JpaRepository<EmotionAnalysis, Integer> {

    // 분석시 가장 점수 높은 감정 가져오는 쿼리
    @Query("SELECT ea FROM EmotionAnalysis ea WHERE ea.user = :user AND ea.emotions = :emotion " +
            "AND ea.startDate = :startDate AND ea.endDate = :endDate")
    EmotionAnalysis findTopEmotion(
            @Param("user") User user,
            @Param("emotion") Emotions emotion,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Diary의 createdAt을 기준으로 diaryEmotion데이터를 가져오는 쿼리 (diaryEmotion은 수정한 날짜로 createdAt이 분석 오류가 생김)
    @Query("SELECT de FROM DiaryEmotion de " +
            "JOIN de.diary d " +
            "WHERE d.user = :user AND d.createdAt BETWEEN :startDate AND :endDate")
    List<DiaryEmotion> findByDiaryCreatedAtForDiaryEmotion(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // 기존에 분석 결과가 있으면 삭제하는 쿼리 / 포함되는 date 결과 모두 삭제
    @Modifying
    @Query("DELETE FROM EmotionAnalysis ea WHERE ea.user = :user AND ea.startDate >= :startDate AND ea.endDate <= :endDate")
    void deleteAnalysis(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}