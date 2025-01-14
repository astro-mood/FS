package com.astro.mood.data.repository.emotions;

import com.astro.mood.data.entity.emotion.Emotions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmotionsRepository extends JpaRepository<Emotions,Integer> {
}
