package com.astro.mood.web.dto.comment;

import com.astro.mood.data.entity.diary.DiaryComment;
import com.astro.mood.data.entity.worry.WorryComment;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentRequest {
    private Integer commentIdx;
    private Integer parentIdx;
    @NotNull
    private String content;

    public WorryComment toWorryComment(){
        WorryComment comment = new WorryComment();
        comment.setContent(this.content);
        if(parentIdx != null){
            comment.setParentComment(WorryComment.builder().commentIdx(this.parentIdx).build());
        }
        return comment;
    }

    public DiaryComment toDiaryComment(){
        DiaryComment comment = new DiaryComment();
        comment.setContent(this.content);      // 내용 설정
        return comment;
    }
}
