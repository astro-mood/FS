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
import com.astro.mood.web.dto.comment.ReceiveWorryCommentResponse; // DTO import

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

    //받은 답변
    @Query("SELECT new com.astro.mood.web.dto.comment.ReceiveWorryCommentResponse(" +
            "wc.commentIdx, " +
            "wc.worry.worryIdx, " +
            "wc.worry.title, " +
            "wc.worry.createdAt, " +
            "wc.worry.isResolved, " +
            "wc.userIdx, " +
            "wc.content, " +
            "n.isRead, " +
            "wc.isReported, " +
            "wc.isDeleted, " +
            "wc.likeCount, " +
            "wc.createdAt, " +
            "(CASE WHEN l.user.userIdx IS NOT NULL THEN TRUE ELSE FALSE END)) isLiked " +
            "FROM WorryComment wc " +
            "JOIN wc.worry w " +
            "LEFT JOIN Notice n ON wc.commentIdx = n.wcIdx AND n.userIdx = :userIdx AND n.type = :type " +
            "LEFT JOIN Likes l ON wc.commentIdx = l.worryComment.commentIdx AND l.user.userIdx = :userIdx " +
            "WHERE w.user.userIdx = :userIdx " +
            "AND wc.parentComment IS NULL " +
            "ORDER BY n.isRead ASC, wc.createdAt DESC")
    Page<ReceiveWorryCommentResponse> findCommentsByUserAndNoticeType(@Param("userIdx") Integer userIdx, @Param("type") String type, Pageable pageable);




}
