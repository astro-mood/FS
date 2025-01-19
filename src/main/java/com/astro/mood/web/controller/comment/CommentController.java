package com.astro.mood.web.controller.comment;

import com.astro.mood.security.login.CustomUserDetails;
import com.astro.mood.service.auth.AuthService;
import com.astro.mood.service.comment.DiaryCommentService;
import com.astro.mood.service.comment.WorryCommentService;
import com.astro.mood.service.exception.CustomException;
import com.astro.mood.service.exception.ErrorCode;
import com.astro.mood.web.dto.ApiResponse;
import com.astro.mood.web.dto.comment.CommentRequest;
import com.astro.mood.web.dto.comment.DiaryCommentResponse;
import com.astro.mood.web.dto.comment.WorryCommentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api")
public class CommentController {
    //일기와 고민에서 공통으로 사용할 수 있는 컨트롤러
    
    private final AuthService authService;
    private final DiaryCommentService diaryCommentService;
    private final WorryCommentService worryCommentService;


    //일기 댓글 조회
    @GetMapping("/{type}-comments/{postIdx}")
    public ResponseEntity<ApiResponse<Page<?>>> getComments(
            @PathVariable Integer postIdx, @PathVariable String type,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
            ) {

        try{
            if(type.equals("diary")){
                Page<DiaryCommentResponse> result = diaryCommentService.getCommentsByDiary(postIdx, userDetails.getUserIdx(), PageRequest.of(page, size));
                return ResponseEntity.ok(ApiResponse.ok(result));
            }else if(type.equals("worry")){
                Page<WorryCommentResponse> result = worryCommentService.getCommentsByWorry(postIdx, PageRequest.of(page, size));
                return ResponseEntity.ok(ApiResponse.ok(result));
            }else{
                throw new CustomException(ErrorCode.NOT_FOUND_END_POINT);
            }

        } catch (Exception e) {
            log.error("댓글 조회 error : {}", e.getMessage(), e);
            throw e;
        }
    }



    // 댓글 추가
    @PostMapping("/{type}-comments/{postIdx}")
    public ResponseEntity<ApiResponse<?>> addComment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String type,  @PathVariable Integer postIdx,
            @RequestBody CommentRequest commentRequest
    ) {
        // 유저 검증
        authService.validateUser(userDetails, 0);
        try{
            if(type.equals("diary")){
                DiaryCommentResponse addedComment = diaryCommentService.addComment(postIdx, userDetails.getUserIdx(), commentRequest); 
                return ResponseEntity.ok(ApiResponse.created(addedComment));
            }else if(type.equals("worry")){
                WorryCommentResponse addedComment = worryCommentService.addComment(postIdx, userDetails.getUserIdx(), commentRequest); 
                return ResponseEntity.ok(ApiResponse.created(addedComment));
            }else{
                throw new CustomException(ErrorCode.NOT_FOUND_END_POINT);
            }
        }catch (Exception e) {
            log.error("댓글 추가 error : {}", e.getMessage(), e);
            throw e;
        }
    }




    // 댓글 수정
    @PutMapping("/{type}-comments/{commentIdx}")
    public ResponseEntity<ApiResponse<?>> modifyComment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String type, @PathVariable Integer commentIdx,
            @RequestBody CommentRequest commentRequest
    ) {
        // 유저 검증
        authService.validateUser(userDetails, 0);
        try{
            if(type.equals("diary")){
                DiaryCommentResponse comment = diaryCommentService.modifyComment(commentIdx, userDetails.getUserIdx(), commentRequest);
                return ResponseEntity.ok(ApiResponse.ok(comment));
            }else if(type.equals("worry")){
                WorryCommentResponse comment = worryCommentService.modifyComment(userDetails.getUserIdx(), commentIdx, commentRequest);
                return ResponseEntity.ok(ApiResponse.ok(comment));
            }else{
                throw new CustomException(ErrorCode.NOT_FOUND_END_POINT);
            }
        }catch (Exception e) {
            log.error("댓글 수정 error : {}", e.getMessage(), e);
            throw e;
        }
    }

    // 댓글 삭제
    @DeleteMapping("/{type}-comments/{commentIdx}")
    public ResponseEntity<ApiResponse<?>> deleteComment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Integer commentIdx,
            @PathVariable String type
    ) {
        // 유저 검증
        authService.validateUser(userDetails, 0);
        try{
            if(type.equals("diary")){
                diaryCommentService.deleteComment(userDetails.getUserIdx(), commentIdx);
            }else if(type.equals("worry")){
                worryCommentService.deleteComment(userDetails.getUserIdx(), commentIdx);
            }else{
                throw new CustomException(ErrorCode.NOT_FOUND_END_POINT);
            }
        }catch (Exception e) {
            log.error("댓글 삭제 error : {}", e.getMessage(), e);
            throw e;
        }

        return ResponseEntity.ok(ApiResponse.ok("댓글이 삭제되었습니다."));
    }


}
