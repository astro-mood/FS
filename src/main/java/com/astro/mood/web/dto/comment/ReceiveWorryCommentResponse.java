package com.astro.mood.web.dto.comment;

import com.astro.mood.data.entity.worry.WorryComment;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class ReceiveWorryCommentResponse {
    private Integer commentIdx;
    private Integer parentCommentIdx;
    private Integer worryIdx;
    private String worryTitle;
    private Integer userIdx;
    private String content;
    private Boolean isReported;
    private Boolean isDeleted;
    private int likeCount;
    private String createdAt;
    private Boolean isLiked;

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

}
