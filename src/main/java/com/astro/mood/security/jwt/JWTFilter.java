package com.astro.mood.security.jwt;

import com.astro.mood.security.login.CustomUserDetails;
import com.astro.mood.service.auth.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
@Slf4j
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestURI = request.getRequestURI(); // 요청 URI를 가져옴
        // /v3/api-docs 경로는 JWT 인증을 통과하도록 설정
        if (requestURI.equals("/v3/api-docs") || requestURI.startsWith("/swagger-ui") || requestURI.startsWith("/static")) {
            filterChain.doFilter(request, response); // 필터 체인을 계속 진행
            return; // 더 이상 처리하지 않음
        }


        // request에서 Authorization 헤더 찾음
        String authorization = request.getHeader("Authorization");

        // Authorization 헤더 검증
        // Authorization 헤더가 비어있거나 "Bearer " 로 시작하지 않은 경우
        if(authorization == null || !authorization.startsWith("Bearer ")){
            log.info("JWTFilter token null");
            // 토큰이 유효하지 않으므로 request와 response를 다음 필터로 넘겨줌
            filterChain.doFilter(request, response);
            // 메서드 종료
            return;
        }

        // Authorization에서 Bearer 접두사 제거
        String token = authorization.substring(7); // "Bearer " 다음부터의 문자열




        if (token != null ) {
            // token 소멸 시간 검증
            // 유효기간이 만료한 경우
            if(jwtUtil.isExpired(token)){
                //TODO 1. 엑세스토큰 만료시, 리프레시토큰 만료시간 체크
                //TODO 2. 리프레시토튼이 만료되지 않았다면, 액세스토큰 재발급
                //TODO 3. 리프레시토튼이 만료되었다면, 메서드 종료하고 로그아웃처리.->다시 로그인해서 생성하도록 하기.
                log.warn("token 유효기간  만료");
                filterChain.doFilter(request, response);
                // 메서드 종료
                return;
            }

            if (jwtUtil.validateToken(token)) {
                // 스프링 시큐리티 인증 토큰 생성
                Authentication authentication = jwtUtil.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않은 토큰입니다.");
                return;
            }
        }

        // 다음 필터로 request, response 넘겨줌
        filterChain.doFilter(request, response);
    }

}