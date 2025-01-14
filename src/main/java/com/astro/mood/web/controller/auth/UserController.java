package com.astro.mood.web.controller.auth;

import com.astro.mood.security.jwt.JWTUtil;
import com.astro.mood.security.login.CustomUserDetails;
import com.astro.mood.service.auth.AuthService;
import com.astro.mood.service.exception.CustomException;
import com.astro.mood.service.exception.ErrorCode;
import com.astro.mood.service.s3Image.AwsS3Service;
import com.astro.mood.web.dto.ApiResponse;
import com.astro.mood.web.dto.auth.UserInfoRequest;
import com.astro.mood.web.dto.auth.UserInfoResponse;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController()
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/user")
public class UserController {
    private final AuthService authService;
    // s3 service
    private final AwsS3Service awsS3Service;

    @Value("${cloud.aws.s3.buckets.bucket1.name}")
    private String bucket;

    private final JWTUtil jwtUtil;

    //유저정보 보기
    @GetMapping("/{loginIdx}")
    public ApiResponse<?> getUserInfo( @PathVariable Integer loginIdx, @AuthenticationPrincipal CustomUserDetails userDetails) {
        // 유저 검증
        authService.validateUser(userDetails, loginIdx);
        try{
            UserInfoResponse result = authService.getUserInfo(loginIdx);
            return ApiResponse.ok(result);
        } catch (Exception e) {
            log.error("유저정보 error : {}", e.getMessage(), e);
            throw e;
        }
    }

    //유저정보 수정
    @PutMapping("/{loginIdx}")
    public ApiResponse<?> putUserInfo(
            @PathVariable Integer loginIdx,
            @Valid @ModelAttribute UserInfoRequest userInfoRequest,
            HttpServletResponse response,
            @RequestParam(value = "profileImage", required = false) MultipartFile image,
            @AuthenticationPrincipal CustomUserDetails userDetails
    )  {
        // 유저 검증
        authService.validateUser(userDetails, loginIdx);

        String previousImageUrl = userDetails.getProfileImage();
        String newImageUrl = null;

        try{
            //1. 이미지 처리
            if (image != null) {
                newImageUrl = awsS3Service.upload(image);
                userDetails.setProfileImage(newImageUrl);
            }
            //2. 유저정보 처리(트랜잭션)
            userInfoRequest.setUserIdx(loginIdx);
            UserInfoResponse result = authService.putUserInfo(userInfoRequest, newImageUrl);

            //3. 이미지 삭제처리(기존 이미지가 있으면 삭제)
            if (newImageUrl != null && !previousImageUrl.isEmpty()) {
                if(previousImageUrl.split("/")[2].equals(bucket+".s3.ap-northeast-2.amazonaws.com")){
                    awsS3Service.deleteImageFromS3(previousImageUrl);
                }
            }

            // JWT 토큰 재발급
            userDetails.setNickname(userInfoRequest.getNickname());
            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());

            String newToken = jwtUtil.createJwt(authentication);

            if (jwtUtil.validateToken(newToken)) {
                // 스프링 시큐리티 인증 토큰 생성
                authentication = jwtUtil.getAuthentication(newToken);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                response.setHeader("Bearer_Token", newToken);
            } else {
                log.error("새로 발급된 JWT 토큰이 유효하지 않습니다.");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않은 토큰입니다.");
            }

            return ApiResponse.ok(result);

        } catch (CustomException e) {
            if (newImageUrl != null) {
                awsS3Service.deleteImageFromS3(newImageUrl);
            }
            log.error("유저정보 수정 CustomException error : {} ", e.getMessage(), e);
            throw e;
        } catch (IOException e) {
            log.error("유저정보 수정 토큰 error : {} ", e.getMessage(), e);
            throw new CustomException(ErrorCode.UNEXPECTED_ERROR);
        } catch (Exception e) {
            log.error("유저정보 수정 error : {} ", e.getMessage(), e);
            throw e;
        }
    }

}
