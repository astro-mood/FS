package com.astro.mood.data.repository.worry;

import com.astro.mood.data.entity.worry.Worry;
import com.astro.mood.data.entity.worry.WorryComment;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface WorryCommentRepository  extends JpaRepository<WorryComment,Integer> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT wc FROM WorryComment wc WHERE wc.commentIdx = :commentIdx")
    Optional<WorryComment> findByCommentIdxWithLock(@Param("commentIdx") Integer commentIdx);

    Page<WorryComment> findByWorryAndParentCommentIsNull(Worry worry, Pageable pageable);

    Optional<WorryComment> findByCommentIdx( Integer commentIdx);

    int countByParentCommentAndIsDeletedFalseAndIsReportedFalse(WorryComment parentComment);
    int countByParentComment(WorryComment parentComment);

    int countByUserIdxAndIsDeletedFalseAndIsReportedFalseAndParentCommentIsNull(Integer userIdx);


    @Query("SELECT c FROM WorryComment c JOIN FETCH c.worry WHERE c.worry.worryIdx= :worryIdx AND c.parentComment IS NULL order by c.commentIdx desc")
    Page<WorryComment> findByUserIdAndParentCommentIsNull(@Param("worryIdx") Integer worryIdx, Pageable pageable);

}
