package com.astro.mood.service.likes;


import com.astro.mood.data.entity.likes.Likes;
import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.entity.worry.WorryComment;
import com.astro.mood.data.repository.likes.LikesRepository;
import com.astro.mood.data.repository.worry.WorryCommentRepository;
import com.astro.mood.service.exception.CustomException;
import com.astro.mood.service.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class LikesService {
    private final LikesRepository likesRepository;
    private final WorryCommentRepository commentRepository;

    //좋아요 기능
    @Transactional(transactionManager = "tmJpa")
    public void toggleLike(Integer commentIdx, Integer userIdx) {
        WorryComment comment = commentRepository.findByCommentIdxWithLock(commentIdx)
                .orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
        if(comment.getIsReported()){
            throw new CustomException(ErrorCode.LIKE_COMMENT_IS_REPORTED);
        }
        User user = User.builder().userIdx(userIdx).build();
        //db에서 좋아요 기록 가져오기
        Optional<Likes> userLikes = likesRepository.findByWorryCommentAndUser(comment, user);

        if(userLikes.isPresent()) {
            //좋아요 취소 처리
            likesRepository.delete(userLikes.get());
            updateLikeCount(comment, -1);
        }else{
            //좋아요 처리
            Likes like = Likes.builder()
                    .worryComment(comment)
                    .user(user)
                    .build();
            likesRepository.save(like);
            updateLikeCount(comment, 1);
        }
    }

    // 좋아요 수 수정 메서드
    private void updateLikeCount(WorryComment comment, int increment) {
        int newLikeCount = comment.getLikeCount() + increment;
        comment.setLikeCount(newLikeCount);
        commentRepository.save(comment);
    }
}
