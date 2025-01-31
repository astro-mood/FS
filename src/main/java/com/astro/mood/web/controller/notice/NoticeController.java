package com.astro.mood.web.controller.notice;

import com.astro.mood.security.login.CustomUserDetails;
import com.astro.mood.service.auth.AuthService;
import com.astro.mood.service.notice.NoticeService;
import com.astro.mood.web.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api")
public class NoticeController {
    //고민 댓글에만 있는 기능 컨트롤러

    private final AuthService authService;
    private final NoticeService noticeService;


    //고민 답변 알림 읽음 표시
    @PatchMapping("/notice-{type}/{worryIdx}")
    public ResponseEntity<ApiResponse<?>> noticeIsReadByWorryIdx(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String type, @PathVariable Integer worryIdx
    ) {
        // 유저 검증
        authService.validateUser(userDetails, 0);
        noticeService.readNoticesByWorryIdx(type, worryIdx);

        return ResponseEntity.ok(ApiResponse.ok("읽음 처리되었습니다."));
    }

    // 알림 전부 읽음 표시
    @PatchMapping("/notice-{type}")
    public ResponseEntity<ApiResponse<?>> noticeIsReadByWorryIdx(
            @AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable String type
    ) {
        // 유저 검증
        authService.validateUser(userDetails, 0);
        noticeService.readNotices(userDetails.getUserIdx(), type);

        return ResponseEntity.ok(ApiResponse.ok("읽음 처리되었습니다."));
    }

}
