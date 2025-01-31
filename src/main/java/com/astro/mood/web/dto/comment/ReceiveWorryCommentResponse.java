package com.astro.mood.web.dto.comment;

import com.astro.mood.data.entity.worry.WorryComment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReceiveWorryCommentResponse {
    private Integer commentIdx;
    private Integer worryIdx;
    private String worryTitle;
    private String worryCreatedAt;
    private Boolean isResolved;

    private Integer userIdx;
    private String content;
    private Boolean isRead;
    private Boolean isReported;
    private Boolean isDeleted;
    private Integer likeCount;
    private String createdAt;
    private Boolean isLiked;

    private Integer parentCommentIdx;

    public static ReceiveWorryCommentResponse toDto(WorryComment comment) {
        ReceiveWorryCommentResponse commentDto = new ReceiveWorryCommentResponse();
        commentDto.setCommentIdx(comment.getCommentIdx());
        commentDto.setWorryIdx(comment.getWorry().getWorryIdx());
        commentDto.setWorryTitle(comment.getWorry().getTitle());
        commentDto.setUserIdx(comment.getUserIdx());
        commentDto.setContent(comment.getContent());
        commentDto.setIsReported(comment.getIsReported());
        commentDto.setIsDeleted(comment.getIsDeleted());
        commentDto.setLikeCount(comment.getLikeCount());
        commentDto.setCreatedAt(comment.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        // 부모 댓글 설정
        if (comment.getParentComment() != null) {
            commentDto.setParentCommentIdx(comment.getParentComment().getCommentIdx());
        }

        return commentDto;
    }
    // 생성자
    public ReceiveWorryCommentResponse(Integer commentIdx,
                                       Integer worryIdx, String worryTitle,
                                       LocalDateTime worryCreatedAt,Boolean isResolved,
                                       Integer userIdx, String content, Boolean isRead,
                                       Boolean isReported, Boolean isDeleted,
                                       Integer likeCount, LocalDateTime createdAt,
                                       Boolean isLiked) {
        this.commentIdx = commentIdx;
        this.worryIdx = worryIdx;
        this.worryTitle = worryTitle;
        this.worryCreatedAt = worryCreatedAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        this.isResolved = isResolved;
        this.userIdx = userIdx;
        this.content = content;
        this.isRead = isRead;
        this.isReported = isReported;
        this.isDeleted = isDeleted;
        this.likeCount = likeCount;
        this.createdAt = createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        this.isLiked = isLiked;
    }
}
