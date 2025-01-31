package com.astro.mood.web.dto.comment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendWorryCommentResponse {
    private Integer commentIdx;
    private Integer worryIdx;
    private String worryTitle;
    private String worryCreatedAt;
    private Boolean isResolved;

    private Integer userIdx;
    private String content;
    private Boolean isReported;
    private Boolean isDeleted;
    private Integer likeCount;
    private String createdAt;
    private Boolean isLiked;

    private Integer parentCommentIdx;


    // 생성자
    public SendWorryCommentResponse(Integer commentIdx,
                                    Integer worryIdx, String worryTitle,
                                    LocalDateTime worryCreatedAt, Boolean isResolved,
                                    Integer userIdx, String content,
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
        this.isReported = isReported;
        this.isDeleted = isDeleted;
        this.likeCount = likeCount;
        this.createdAt = createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        this.isLiked = isLiked;
    }
}
