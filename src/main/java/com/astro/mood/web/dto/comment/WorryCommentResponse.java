package com.astro.mood.web.dto.comment;

import com.astro.mood.data.entity.worry.WorryComment;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class WorryCommentResponse {
    private Integer commentIdx;
    private Integer parentCommentIdx;
    private Integer worryIdx;
    private Integer userIdx;
    private String content;
    private Boolean isReported;
    private Boolean isDeleted;
    private int likeCount;
    private String createdAt;

    private List<WorryCommentResponse> childrenComments; // 자식 댓글

    // Comment 엔티티를 CommentDto로 변환하는 메서드
    public static WorryCommentResponse toDto(WorryComment comment) {
        WorryCommentResponse commentDto = new WorryCommentResponse();
        commentDto.setCommentIdx(comment.getCommentIdx());
        commentDto.setWorryIdx(comment.getWorryIdx());
        commentDto.setUserIdx(comment.getUserIdx());
        commentDto.setContent(comment.getContent());
        commentDto.setIsReported(comment.getIsReported());
        commentDto.setIsDeleted(comment.getIsDeleted());
        commentDto.setLikeCount(comment.getLikeCount());
        commentDto.setCreatedAt(comment.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));


        // 부모 댓글 설정
        if (comment.getParentComment() != null) {
            commentDto.setParentCommentIdx(comment.getParentComment().getCommentIdx());
//            commentDto.setParentComment(toDto(comment.getParentComment()));
        }

        // 자식 댓글 설정
        if (comment.getChildrenComment() != null) {
            List<WorryCommentResponse> childrenDtos = comment.getChildrenComment().stream()
                    .map(WorryCommentResponse::toDto)
                    .collect(Collectors.toList());
            commentDto.setChildrenComments(childrenDtos);
        }

        return commentDto;
    }


    // CommentDto를 Comment 엔티티로 변환하는 메서드
    public WorryComment toEntity() {
        WorryComment comment = new WorryComment();
        comment.setCommentIdx(this.commentIdx);
        comment.setContent(this.content);
        comment.setUserIdx(this.userIdx);
        comment.setIsReported(this.isReported);
        comment.setIsDeleted(this.isDeleted);
        comment.setLikeCount(this.likeCount);
        // 작성 시간을 현재 시간으로 설정
        comment.setCreatedAt(LocalDateTime.now());

        // 부모 댓글 설정
        if (this.parentCommentIdx != null) {
            comment.setParentComment(WorryComment.builder().commentIdx(this.parentCommentIdx ).build());
        }

        // 자식 댓글 설정
        if (this.childrenComments != null) {
            List<WorryComment> childrenEntities = this.childrenComments.stream()
                    .map(childDto -> {
                        WorryComment childComment = childDto.toEntity();
                        childComment.setParentComment(comment); // 부모 댓글 설정
                        return childComment;
                    })
                    .collect(Collectors.toList());
            comment.setChildrenComment(childrenEntities);
        }

        return comment;
    }
}
