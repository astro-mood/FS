package com.astro.mood.web.controller;

import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.entity.user.UserToken;
import com.astro.mood.data.repository.auth.AuthRepository;
import com.astro.mood.data.repository.auth.UserTokenRepository;
import com.astro.mood.security.jwt.JWTUtil;
import com.astro.mood.web.dto.auth.UserRole;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class GoogleLoginController {
    private final AuthRepository authRepository;
    private final UserTokenRepository userTokenRepository;
    private final JWTUtil jwtUtil;

    public GoogleLoginController(AuthRepository authRepository, UserTokenRepository userTokenRepository, JWTUtil jwtUtil) {
        this.authRepository = authRepository;
        this.userTokenRepository = userTokenRepository;
        this.jwtUtil = jwtUtil;
    }

    // 프론트엔드에서 post보내는 요청 받아주기 위해
    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@RequestBody Map<String, String> payload,   HttpServletResponse httpServletResponse) {
        String idToken = payload.get("idToken");

        if (idToken == null || idToken.isEmpty()) {
            return ResponseEntity.badRequest().body("ID Token is missing or invalid.");
        }

        // 토큰 받는 것 확인 완료. Google 서버와 통신하여 ID 토큰 검증
        RestTemplate restTemplate = new RestTemplate();
        String googleVerifyUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;

        try {
            Map<String, Object> userInfo = restTemplate.getForObject(googleVerifyUrl, Map.class);

            // ID Token 유효성 검증 실패 시
            if (userInfo == null || !userInfo.containsKey("email")) {
                return ResponseEntity.status(401).body("Invalid ID Token");
            }

            // 사용자 정보를 활용하여 JWT 생성
            String email = userInfo.get("email").toString();
            String providerId = userInfo.get("sub").toString();
            String picture = userInfo.get("picture").toString();
            String name = userInfo.get("name").toString();
            String role = UserRole.ROLE_USER.toString(); // 기본 역할 설정 (필요에 따라 변경 가능)

            String jwtToken = jwtUtil.createJwtEmail(email, role);
            String refreshToken = jwtUtil.createRefreshToken(email);

            // 성공 확인 로그
            System.out.println("Authenticated user: " + userInfo.get("email"));

            //DB 유저정보 확인
            Optional<User> findUser = authRepository.findUserByOauthIdAndOauthProvider(providerId, "GOOGLE");
            User user;
            if (findUser.isEmpty() ) {
                //유저정보가 없으면 회원가입
                user = User.builder()
                        .email(email)
                        .nickname(name)
                        .authorities(new HashSet<>(List.of(UserRole.ROLE_USER)))
                        .isDeleted(false)
                        .profileImage(picture)
                        .oauthId(providerId)
                        .oauthProvider("GOOGLE")
                        .build();
                authRepository.save(user);
                // Access Token 저장
                UserToken userToken = UserToken.builder()
                        .accessToken(jwtToken)
                        .refreshToken(refreshToken)
                        .user(user)
                        .expiresAt(LocalDateTime.now().plusDays(30)) // Refresh Token 만료 시간 설정
                        .build();
                userTokenRepository.save(userToken);
            } else{
                user = findUser.get();
                // 기존 사용자에 대한 Access Token 업데이트
                UserToken userToken = userTokenRepository.findByUser(user);
                if (userToken != null || jwtUtil.isExpired(userToken.getAccessToken()) ) {
                    userToken.setAccessToken(jwtToken);
                    userTokenRepository.save(userToken);
                }
            }

            System.out.println("jwtToken :" + jwtToken);
            System.out.println("refreshtoken :" + refreshToken);
            httpServletResponse.setHeader("Bearer_Token", jwtToken);
            // 응답으로 JWT와 사용자 정보를 반환
            return ResponseEntity.ok(Map.of(
                    "token", jwtToken,
                    "refreshToken", refreshToken,
                    "user", userInfo
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid ID Token: " + e.getMessage());
        }
    }
}
