package com.astro.mood.web.controller.comment;

import com.astro.mood.security.login.CustomUserDetails;
import com.astro.mood.service.auth.AuthService;
import com.astro.mood.service.comment.WorryCommentService;
import com.astro.mood.web.dto.ApiResponse;
import com.astro.mood.web.dto.comment.CommentRequest;
import com.astro.mood.web.dto.comment.WorryCommentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/worry-comments")
public class WorryCommentController {
    //고민 댓글에만 있는 기능 컨트롤러

    private final AuthService authService;
    private final WorryCommentService worryCommentService;


    //대댓글 추가
    @PostMapping("/reply/{parentCommentIdx}")
    public ResponseEntity<ApiResponse<WorryCommentResponse>> addReply(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Integer parentCommentIdx, @RequestBody CommentRequest commentRequest
    ) {
        // 유저 검증
        authService.validateUser(userDetails, 0);

        WorryCommentResponse addedReply = worryCommentService.replyComment(parentCommentIdx, userDetails.getUserIdx(), commentRequest); // 대댓글 추가
        return ResponseEntity.ok(ApiResponse.created(addedReply));  // 추가된 대댓글 반환
    }

    // 댓글 신고
    @PatchMapping("/{commentIdx}")
    public ResponseEntity<ApiResponse<?>> reportedComment(
            @AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Integer commentIdx
    ) {
        // 유저 검증
        authService.validateUser(userDetails, 0);
        worryCommentService.reportComment(userDetails.getUserIdx(), commentIdx);

        return ResponseEntity.ok(ApiResponse.ok("댓글이 신고되었습니다."));
    }

}
