package com.astro.mood.web.controller.likes;

import com.astro.mood.security.login.CustomUserDetails;
import com.astro.mood.service.exception.CustomException;
import com.astro.mood.service.exception.ErrorCode;
import com.astro.mood.service.likes.LikesService;
import com.astro.mood.web.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/likes")
public class LikesController {
    private final LikesService likesService;

    // 좋아요 기능
    @PostMapping("/{commentIdx}")
    public ResponseEntity<ApiResponse<?>>  toggleLike(@PathVariable Integer commentIdx, @AuthenticationPrincipal CustomUserDetails userDetails) {
        // 유저 검증
        if (userDetails == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        Integer userIdx = userDetails.getUserIdx();
        likesService.toggleLike(commentIdx, userIdx);
        return ResponseEntity.ok(ApiResponse.ok("좋아요 상태가 변경되었습니다."));
    }
}