package com.astro.mood.data.repository.diary;

import com.astro.mood.data.entity.diary.DiaryComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DiaryCommentRepository extends JpaRepository<DiaryComment, Integer> {

    Optional<DiaryComment> findByDcIdx(Integer dcIdx);


    //커서 페이징 추가
    List<DiaryComment> findByDiaryIdxOrderByDcIdxAsc(Integer diaryIdx, Pageable pageable);
    List<DiaryComment> findByDiaryIdxAndDcIdxGreaterThanOrderByDcIdxAsc(Integer diaryIdx, Integer lastCommentId, Pageable pageable);
}
