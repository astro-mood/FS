package com.astro.mood.data.repository.diary;

import com.astro.mood.data.entity.diary.DiaryEmotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiaryEmotionRepository extends JpaRepository<DiaryEmotion, Integer> {
}
