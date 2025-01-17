package com.astro.mood.data.repository.diary;

import com.astro.mood.data.entity.diary.Diary;
import com.astro.mood.data.entity.diary.DiaryEmotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DiaryEmotionRepository extends JpaRepository<DiaryEmotion, Integer> {
    @Query("SELECT de FROM DiaryEmotion de JOIN FETCH de.emotions WHERE de.diary = :diary")
    List<DiaryEmotion> findByDiary(@Param("diary") Diary diary);
}
