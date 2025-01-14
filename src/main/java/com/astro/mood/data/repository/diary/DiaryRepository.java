package com.astro.mood.data.repository.diary;

import com.astro.mood.data.entity.diary.Diary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiaryRepository extends JpaRepository<Diary, Integer> {
}
