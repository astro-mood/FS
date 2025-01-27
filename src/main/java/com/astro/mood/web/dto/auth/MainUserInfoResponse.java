package com.astro.mood.web.dto.auth;

import com.astro.mood.data.entity.level.LevelThresholds;
import com.astro.mood.data.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MainUserInfoResponse {
    private int userIdx;

    //작성한 일기 수
    private int diaryCount;

    //위로 건넨 횟수
    private int commentCount;

    //받은 답변 보기
    private int answerCount;
    
    //레벨
    private LevelThresholds level;

    //경험치 퍼센트
    private int exp;

    public MainUserInfoResponse(User user, LevelThresholds level, int diaryCount, int answerCount) {
        this.userIdx=user.getUserIdx();
        this.commentCount = user.getCommentCount();
        this.diaryCount = diaryCount;
        this.answerCount = answerCount;
        this.level = level;

        //경험치
        if(user.getCommentCount() == 0) {
            this.exp = 0;
        }else if(level.getLevel() == 10) {
            this.exp = 100;
        }else{
            double commentCountD = user.getCommentCount();
            double levelThresholdD = (double) level.getThreshold();
            double result = (commentCountD / levelThresholdD)  * 100;
            this.exp = (int)result ;
        }
    }

    public static MainUserInfoResponse from(User user, LevelThresholds level, int diaryCount, int answerCount) {
      return new MainUserInfoResponse(user, level, diaryCount, answerCount);
    }
}
