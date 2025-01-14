package com.astro.mood.security.jwt;

import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.entity.user.UserToken;
import com.astro.mood.security.login.CustomUserDetails;
import com.astro.mood.service.auth.CustomUserDetailsService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
public class GoogleLoginFilter extends AbstractAuthenticationProcessingFilter {

    private final JWTUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    public GoogleLoginFilter(String defaultFilterProcessesUrl, AuthenticationManager authenticationManager,
                             JWTUtil jwtUtil, CustomUserDetailsService customUserDetailsService) {
        super(new AntPathRequestMatcher(defaultFilterProcessesUrl));
        setAuthenticationManager(authenticationManager);
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
    }


    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException {
        // 요청 객체가 null인지 확인
        if (request == null) {
            throw new AuthenticationException("HttpServletRequest is null") {};
        }
        String provider =request.getRequestURI().split("/")[3].toUpperCase();

        // 요청 본문에서 ID Token 가져오기
        String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        Map<String, String> payload = new ObjectMapper().readValue(body, new TypeReference<Map<String, String>>() {});
        String idToken = payload.get("idToken");
        if (idToken == null || idToken.isEmpty()) {
            throw new AuthenticationException("ID Token is missing or invalid.") {};
        }

        // ID Token 검증
        Map<String, Object> userInfo;
        try {
            userInfo = jwtUtil.verifyIdToken(idToken);
            //log.info("ID Token 검증 성공: {}", userInfo);
        } catch (Exception e) {
            log.error("ID Token 검증 실패: {}", e.getMessage());
            throw new AuthenticationException("ID Token 검증 실패.") {};
        }

        String providerId = "";
        if(provider.equals("GOOGLE")){
            log.info("구글 로그인 시도 중");
            providerId = userInfo.get("sub").toString();
        }

        // UserDetails 생성
        UserDetails userDetails = customUserDetailsService.loadUser(userInfo, provider);

        // 인증 객체 생성
        Authentication authenticated = new  UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
        //log.info("authenticated: {}", authenticated);
        return authenticated;
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) throws IOException {
        log.info("로그인 성공 ");
        // JWT 생성
        CustomUserDetails user = (CustomUserDetails) authResult.getPrincipal();
        System.out.println(user.toString());
        String token = jwtUtil.createJwt(authResult);

        //DB 토큰 검색
        CustomUserDetails userDetails = (CustomUserDetails) authResult.getPrincipal();
        UserToken userToken = customUserDetailsService.findUserToken(userDetails.getUserIdx());
        Integer userIdx = userDetails.getUserIdx();

        if(userToken == null){
            String refreshToken = jwtUtil.createRefreshToken( userIdx);
            UserToken newUserToken = UserToken.builder()
                    .accessToken(token)
                    .refreshToken(refreshToken)
                    .user(User.builder().userIdx(userIdx).build())
                    .expiresAt(LocalDateTime.now().plusDays(30)) // Refresh Token 만료 시간 설정
                    .build();
            customUserDetailsService.saveRefreshToken(newUserToken);
            userToken = newUserToken;
        }else{
            if(jwtUtil.isExpired(userToken.getRefreshToken())){
                log.info("RefreshToken 만료되어 업데이트진행");
                String refreshToken = jwtUtil.createRefreshToken(userIdx);
                userToken.setRefreshToken(refreshToken);
                userToken.setExpiresAt(LocalDateTime.now().plusDays(30));
                customUserDetailsService.saveRefreshToken(userToken);
            }
        }
        // 리프레시 토큰 쿠키 생성
        Cookie cookie = new Cookie("refreshToken", userToken.getRefreshToken());
        cookie.setHttpOnly(true); // HttpOnly 속성 설정
        cookie.setPath("/"); // 쿠키가 유효한 경로 설정
        cookie.setMaxAge(604800); // 쿠키 유효 시간 (7일)
        response.addCookie(cookie); // 쿠키 추가

        // JWT 응답 헤더에 추가
        response.setHeader("Bearer_Token", token);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("로그인 검증 실패 : " + failed.getMessage());
    }
}