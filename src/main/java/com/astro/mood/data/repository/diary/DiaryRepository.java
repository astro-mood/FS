package com.astro.mood.data.repository.diary;

import com.astro.mood.data.entity.diary.Diary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Integer> {
    //일기 댓글에서 검증용으로 사용
    Optional<Diary> findById(Integer diaryIdx);
}
