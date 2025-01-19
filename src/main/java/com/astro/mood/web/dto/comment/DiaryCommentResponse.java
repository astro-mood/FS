package com.astro.mood.web.dto.comment;

import com.astro.mood.data.entity.diary.DiaryComment;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Getter
@NoArgsConstructor
public class DiaryCommentResponse {
    private Integer commentIdx;
    private Integer diaryIdx;
    private String content;

    private String creatAt;

    public DiaryCommentResponse(DiaryComment diaryComment) {
        this.commentIdx = diaryComment.getDcIdx();
        this.diaryIdx = diaryComment.getDiaryIdx();
        this.content = diaryComment.getContent();
        this.creatAt = diaryComment.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
    public static DiaryCommentResponse from(DiaryComment diaryComment) {return new DiaryCommentResponse(diaryComment);}
}
