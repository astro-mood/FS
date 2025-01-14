package com.astro.mood.data.repository.diary;

import com.astro.mood.data.entity.diary.DiaryComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiaryCommentRepository extends JpaRepository<DiaryComment, Integer> {
}
