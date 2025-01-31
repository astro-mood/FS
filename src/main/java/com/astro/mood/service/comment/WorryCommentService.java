package com.astro.mood.service.comment;


import com.astro.mood.data.entity.level.LevelThresholds;
import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.entity.worry.Worry;
import com.astro.mood.data.entity.worry.WorryComment;
import com.astro.mood.data.entity.worry.WorryCommentReport;
import com.astro.mood.data.repository.auth.AuthRepository;
import com.astro.mood.data.repository.level.LevelRepository;
import com.astro.mood.data.repository.likes.LikesRepository;
import com.astro.mood.data.repository.worry.WorryCommentReportsRepository;
import com.astro.mood.data.repository.worry.WorryCommentRepository;
import com.astro.mood.data.repository.worry.WorryRepository;
import com.astro.mood.service.auth.AuthService;
import com.astro.mood.service.exception.CustomException;
import com.astro.mood.service.exception.ErrorCode;
import com.astro.mood.service.notice.NoticeService;
import com.astro.mood.service.wordFilter.BadwordFilterService;
import com.astro.mood.web.dto.comment.CommentRequest;
import com.astro.mood.web.dto.comment.ReceiveWorryCommentResponse;
import com.astro.mood.web.dto.comment.WorryCommentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorryCommentService {
    private final WorryCommentRepository worryCommentRepository;
    private final WorryCommentReportsRepository worryCommentReportsRepository;
    private final WorryRepository worryRepository;
    private final LikesRepository likesRepository;
    private final LevelRepository levelRepository;

    private final AuthService authService;
    private final AuthRepository authRepository;

    private final BadwordFilterService badwordFilterService;
    private final NoticeService noticeService;


    //고민 대상 검증
    public Worry validateWorry(Integer worryIdx){
        return worryRepository.findById(worryIdx).orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
    }
    //비속어 필터링
    public void filteringText(String text){
        if(!badwordFilterService.textFilterCheck(text)) {
            log.info("비속어가 포함되어있음");
            throw new CustomException(ErrorCode.BAD_WORD_FILTER_ERROR);
        }
    }

    // 댓글 추가 메서드
    public WorryCommentResponse addComment(Integer worryIdx, Integer userIdx, CommentRequest commentRequest) {
        Worry worry = validateWorry(worryIdx);
        filteringText(commentRequest.getContent()); // 비속어필터링

        WorryComment comment = commentRequest.toWorryComment();
        comment.setUserIdx(userIdx);
        comment.setWorry(worry);
        comment.setIsReported(false);
        WorryComment savedComment = worryCommentRepository.save(comment);

        //유저정보의 위로 건넨 횟수 카운트 +1(댓글만 해당)
        User user = authService.findUserByIdOrThrow(userIdx);
        int count = getCountCommentsByUserIdx(userIdx);
        user.setCommentCount(count);

        //댓글 입력시 레벨 체크하기
        LevelThresholds levelInfo = levelRepository.findByLevel(user.getLevel());
        if(user.getCommentCount() > levelInfo.getThreshold()){
            user.setLevel(user.getLevel() + 1);
        }

        authRepository.save(user);

        //댓글 등록 유저 idx와 고민글 유저 idx를 비교하여 다를 경우에만 알림 생성
        Integer targetUserIdx = worry.getUser().getUserIdx();
        if(!targetUserIdx.equals(userIdx)){
            noticeService.addNotice(savedComment, targetUserIdx, "comment");
        }

        return WorryCommentResponse.toDto(savedComment);
    }


    //대댓글 추가 메서드
    public WorryCommentResponse replyComment(Integer parentCommentIdx, Integer userIdx, CommentRequest commentRequest) {
        filteringText(commentRequest.getContent()); // 비속어필터링

        //부모댓글 검증
        WorryComment parentComment = worryCommentRepository.findByCommentIdx(parentCommentIdx)
                .orElseThrow( () -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
        if(parentComment.getIsReported()){
            throw new CustomException(ErrorCode.REPLY_COMMENT_IS_REPORTED);
        }else if(parentComment.getIsDeleted()){
            throw new CustomException(ErrorCode.REPLY_COMMENT_IS_DELETED);
        }

        WorryComment reply = WorryComment.builder()
                .parentComment(parentComment)
                .content(commentRequest.getContent())
                .worry(parentComment.getWorry())
                .userIdx(userIdx)
                .isReported(false)
                .isDeleted(false)
                .build();

        WorryComment savedComment = worryCommentRepository.save(reply);

        //댓글 등록 유저 idx와 부모댓글 유저 idx를 비교하여 다를 경우에만 알림 생성
        Integer targetUserIdx =parentComment.getUserIdx();
        if(!targetUserIdx.equals(userIdx)){
            noticeService.addNotice(parentComment, targetUserIdx, "reply");
        }

        return WorryCommentResponse.toDto(savedComment);
    }

    // 걱정 댓글 조회
    @Transactional(transactionManager = "tmJpa")
    public Page<WorryCommentResponse> getCommentsByWorry(Integer worryIdx, Integer userIdx, Pageable pageable) {
        Worry worry =validateWorry(worryIdx);
        Page<WorryComment> comments = worryCommentRepository.findByWorryAndParentCommentIsNull(worry, pageable);
        List<WorryCommentResponse> commentResponses = comments.stream()
                .map(comment -> {
                    WorryCommentResponse response = WorryCommentResponse.toDto(comment);
                    response.setIsLiked(isCommentLikedRecursive(response, userIdx));
                    return response;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(commentResponses, pageable, comments.getTotalElements());
    }

    //좋아요 여부 확인
    private boolean isCommentLikedRecursive(WorryCommentResponse comment, Integer userIdx) {
        if(userIdx == null || userIdx < 1){
            return false;
        }
        // 현재 댓글에 대한 좋아요 여부 확인
        boolean isLiked = isLiked(userIdx, comment.getCommentIdx());

        // 자식 댓글에 대해 재귀적으로 좋아요 여부 설정
        for (WorryCommentResponse childComment : comment.getChildrenComments()) {
            boolean childIsLiked = isCommentLikedRecursive(childComment, userIdx);
            childComment.setIsLiked(childIsLiked);
        }
        return isLiked;
    }
    private boolean isLiked(Integer commentIdx, Integer userIdx){
        return likesRepository.existsByUserIdxAndWorryCommentIdx(userIdx, commentIdx);
    }

    //유저의 댓글 수 조회 - 삭제나 신고 상태인 것을 제외한 부모댓글만 적용
    public int getCountCommentsByUserIdx(Integer userIdx){
        return  worryCommentRepository.countByUserIdxAndIsDeletedFalseAndIsReportedFalseAndParentCommentIsNull(userIdx);
    }

    //댓글 수정
    @Transactional(transactionManager = "tmJpa")
    public WorryCommentResponse modifyComment(Integer userIdx, Integer commentIdx, CommentRequest commentRequest) {
        filteringText(commentRequest.getContent()); // 비속어필터링
        WorryComment comment = worryCommentRepository.findByCommentIdx(commentIdx)
                .orElseThrow( () -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
        if(!comment.getUserIdx().equals(userIdx)){
            throw new CustomException(ErrorCode.FORBIDDEN);
        }else if(comment.getIsReported()){
            throw new CustomException(ErrorCode.CANNOT_EDIT_REPORTED_COMMENT);
        }else if(comment.getIsDeleted()){
            throw new CustomException(ErrorCode.CANNOT_EDIT_DELETED_COMMENT);
        }

        comment.setContent(commentRequest.getContent());
        WorryComment modifyComment = worryCommentRepository.save(comment);
        return WorryCommentResponse.toDto(modifyComment);
    }


    // 댓글 삭제
    @Transactional(transactionManager = "tmJpa")
    public void deleteComment(Integer userIdx, Integer commentIdx) {
        WorryComment comment = worryCommentRepository.findByCommentIdx(commentIdx)
                .orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
        if (!comment.getUserIdx().equals(userIdx)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        } else if (comment.getIsDeleted()) {
            throw new CustomException(ErrorCode.ALREADY_DELETED_COMMENT_ERROR);
        }

        // 댓글 삭제 처리
        handleCommentDeletion(comment);

        //유저 댓글 갯수 수정
        if(comment.getParentComment() == null){
            User user = authService.findUserByIdOrThrow(userIdx);
            int count = getCountCommentsByUserIdx(userIdx);
            user.setCommentCount(count);
            authRepository.save(user);
        }
    }


    // 댓글 삭제 처리 메서드
    private void handleCommentDeletion(WorryComment comment) {
        int childCommentCount = worryCommentRepository.countByParentComment(comment); //자식 갯수

        if (childCommentCount > 0) {
            if (canDeleteRecursively(comment)) {
                // 삭제 가능
                log.info("{}번 댓글은 정상 대댓글이 없으니까 하드딜리트함", comment.getCommentIdx());
                hardDeleteComment(comment);
            } else {
                // 삭제 불가
                log.info("{}번 댓글은 대댓글이 있으므로 소프트딜리트함", comment.getCommentIdx());
                softDeleteComment(comment);
            }
        } else {
            log.info("{}번 댓글은 대댓글이 없으니까 하드딜리트함", comment.getCommentIdx());
            hardDeleteComment(comment);
        }
    }
    // 하드 삭제 메서드
    private void hardDeleteComment(WorryComment comment) {
        WorryComment parentComment = comment.getParentComment();
        worryCommentRepository.delete(comment);
        if (parentComment != null) {
            deleteParentComment(parentComment);
        }
    }

    // 소프트 삭제 메서드
    private void softDeleteComment(WorryComment comment) {
        comment.setIsDeleted(true);
        comment.setContent("응원만 남겨진 \uD83D\uDCE8 입니다.");
        worryCommentRepository.save(comment);
    }

    //부모 댓글 삭제확인 후 삭제
    public void deleteParentComment (WorryComment comment){
        // 자식 댓글 수 조회
        int childCommentCount = worryCommentRepository.countByParentCommentAndIsDeletedFalseAndIsReportedFalse(comment);
        if (childCommentCount == 0 && comment.getIsDeleted()) {
            //삭제된 댓글이면서, 활성화되어있는 자식댓글이 없는 경우 삭제
            WorryComment parentComment = comment.getParentComment();
            worryCommentRepository.delete(comment);
            if(parentComment != null){
                deleteParentComment(parentComment);
            }
        }
    }

    // 재귀적으로 자식 댓글을 검사하는 메서드
    private boolean canDeleteRecursively(WorryComment comment) {
        // 현재 댓글이 "정상" 상태인지 확인
        if (!comment.getIsReported() && !comment.getIsDeleted()) {
            return false; // 정상 댓글이 있으면 삭제 불가
        }

        // 자식 댓글이 있는지 확인
        for (WorryComment child : comment.getChildrenComment()) {
            // 자식 댓글의 상태를 재귀적으로 검사
            if (!canDeleteRecursively(child)) {
                return false; // 자식 댓글 중 하나라도 삭제 불가하면 false 반환
            }
        }
        return true; // 모든 조건을 만족하면 삭제 가능
    }

    //댓글 신고
    @Transactional(transactionManager = "tmJpa")
    public void reportComment(Integer userIdx, Integer commentIdx) {
        WorryComment comment = worryCommentRepository.findByCommentIdxWithLock(commentIdx)
                .orElseThrow( () -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
        if(userIdx.equals(comment.getUserIdx())){
            throw new CustomException(ErrorCode.SELF_REPORT_ERROR);
        }else if(comment.getIsDeleted()){
            throw new CustomException(ErrorCode.DELETED_COMMENT_REPORT_ERROR);
        }else if(comment.getIsReported()){
            throw new CustomException(ErrorCode.ALREADY_REPORTED_COMMENT_ERROR);
        }

        WorryCommentReport wcr = WorryCommentReport.from(userIdx, comment);
        worryCommentReportsRepository.save(wcr);

        comment.setIsReported(true);
        comment.setContent("가려진 \uD83D\uDCE8 입니다.");

        worryCommentRepository.save(comment);

        //알림생성
        noticeService.addNotice(comment, comment.getUserIdx(), "report");

    }

    //유저 받은 답변 보기
    public Page<ReceiveWorryCommentResponse> getReceivedCommentsByUser(Integer userIdx, Pageable pageable){
        authService.findUserByIdOrThrow(userIdx);
        Page<ReceiveWorryCommentResponse> comments = worryCommentRepository.findCommentsByUserAndNoticeType(userIdx, "comment", pageable);
        return comments;
    }
}
