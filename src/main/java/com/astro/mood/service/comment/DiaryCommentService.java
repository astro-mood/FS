package com.astro.mood.service.comment;


import com.astro.mood.data.entity.diary.Diary;
import com.astro.mood.data.entity.diary.DiaryComment;
import com.astro.mood.data.repository.diary.DiaryCommentRepository;
import com.astro.mood.data.repository.diary.DiaryRepository;
import com.astro.mood.service.exception.CustomException;
import com.astro.mood.service.exception.ErrorCode;
import com.astro.mood.web.dto.comment.CommentRequest;
import com.astro.mood.web.dto.comment.DiaryCommentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DiaryCommentService {
    private final DiaryCommentRepository diaryCommentRepository;
    private final DiaryRepository diaryRepository;

    //댓글 대상 검증
    public void validateDiary(Integer diaryIdx, Integer loginIdx){
        Diary diary = diaryRepository.findById(diaryIdx).orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
        if(!diary.getUser().getUserIdx().equals(loginIdx)){
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
    }


    //댓글 조회
    public Page<DiaryCommentResponse> getCommentsByDiary(Integer diaryIdx, Integer loginIdx,  Pageable pageable) {
        validateDiary(diaryIdx, loginIdx);
        Page<DiaryComment> comments = diaryCommentRepository.findAllByDiaryIdx(diaryIdx, pageable);
        return comments.map(DiaryCommentResponse::from);
    }

    //댓글 추가
    public DiaryCommentResponse addComment(Integer diaryIdx, Integer loginIdx, CommentRequest commentRequest) {
        validateDiary(diaryIdx, loginIdx);

        DiaryComment comment = commentRequest.toDiaryComment();
        comment.setDiaryIdx(diaryIdx);

        // 댓글 저장
        DiaryComment savedComment = diaryCommentRepository.save(comment);
        return DiaryCommentResponse.from(savedComment);
    }

    //댓글 수정
    @Transactional(transactionManager = "tmJpa")
    public DiaryCommentResponse modifyComment(Integer dcIdx, Integer loginIdx, CommentRequest commentRequest) {
        DiaryComment comment = diaryCommentRepository.findByDcIdx(dcIdx).orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
        validateDiary(comment.getDiaryIdx(), loginIdx);

        comment.setContent(commentRequest.getContent());
        DiaryComment modifyComment = diaryCommentRepository.save(comment);

        return DiaryCommentResponse.from(modifyComment);
    }

    // 댓글 삭제
    @Transactional(transactionManager = "tmJpa")
    public void deleteComment(Integer loginIdx, Integer dcIdx) {
        DiaryComment comment = diaryCommentRepository.findByDcIdx(dcIdx).orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
        validateDiary(comment.getDiaryIdx(), loginIdx);

        diaryCommentRepository.delete(comment);
    }

}
