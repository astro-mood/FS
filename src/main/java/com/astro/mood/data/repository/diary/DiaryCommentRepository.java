package com.astro.mood.data.repository.diary;

import com.astro.mood.data.entity.diary.DiaryComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface DiaryCommentRepository extends JpaRepository<DiaryComment, Integer> {

    Page<DiaryComment> findAllByDiaryIdx(Integer diaryIdx, Pageable pageable);
    Optional<DiaryComment> findByDcIdx(Integer dcIdx);
}
