package com.astro.mood.data.repository.emotions;

import com.astro.mood.data.entity.emotion.EmotionAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmotionAnalysisRepository extends JpaRepository<EmotionAnalysis,Integer> {
}
