package com.astro.mood.security.jwt;

import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.entity.user.UserToken;
import com.astro.mood.security.login.CustomUserDetails;
import com.astro.mood.service.auth.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@Slf4j
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestURI = request.getRequestURI(); // 요청 URI를 가져옴
        // /v3/api-docs 경로는 JWT 인증을 통과하도록 설정
        if (requestURI.equals("/v3/api-docs") || requestURI.startsWith("/swagger-ui")
                || requestURI.startsWith("/static") || requestURI.startsWith("/logo")|| requestURI.equals("/favicon.ico") || requestURI.equals("/manifest.json")) {
            filterChain.doFilter(request, response); // 필터 체인을 계속 진행
            return; // 더 이상 처리하지 않음
        }


        // request에서 Authorization 헤더 찾음
        String authorization = request.getHeader("Authorization");

        // Authorization 헤더 검증 : 헤더가 비어있거나 "Bearer " 로 시작하지 않은 경우
        if(authorization == null || !authorization.startsWith("Bearer ")){
            log.info("JWTFilter token null / requestURI : {}" ,requestURI);
            // 토큰이 유효하지 않으므로 request와 response를 다음 필터로 넘겨줌
            filterChain.doFilter(request, response);
            // 메서드 종료
            return;
        }

        // Authorization에서 Bearer 접두사 제거
        String token = authorization.substring(7); // "Bearer " 다음부터의 문자열

        // token 소멸 시간 검증
        if(jwtUtil.isExpired(token)){
            // 유효기간이 만료한 경우
            log.warn("token 유효기간  만료");
            //1. 엑세스토큰 만료시, 리프레시토큰 만료시간 체크
            String refreshToken = "";
            // 1-1 쿠키에서 리프레시 토큰 가져오기
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("refreshToken".equals(cookie.getName())) {
                        refreshToken = cookie.getValue();
                    }
                }
            }

            // 1-2 리프레시 토큰 검증
            if(!jwtUtil.validateToken(refreshToken)){
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않은 리프레시 토큰입니다.");
                return;
            }

            // 1-3 리프레시 토큰값으로 DB 토큰정보 가져오기
            Integer loginIdx = jwtUtil.getLoginIdx(refreshToken);
            UserToken userToken = customUserDetailsService.findUserToken(loginIdx);

            // 1-4 쿠키에서 가져온 토큰과 db에서 가져온 토큰이 같은지 확인
            if(!refreshToken.equals(userToken.getRefreshToken())) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않은 리프레시 토큰입니다.");
                return;
            }
            refreshToken = userToken.getRefreshToken();

            // 1-4 리프레시 토큰 만료시간 체크
            if(jwtUtil.isExpired(refreshToken)){
                log.warn("refreshToken 유효기간  만료");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않은 리프레시 토큰입니다.");
                return;
            }else{
                log.info("refreshToken 유효기간이 만료되지 않아 AccessToken 재발급");
                // 2. 사용자 정보를 기반으로 Authentication 객체 생성
                CustomUserDetails userDetails = (CustomUserDetails) customUserDetailsService.loadUserByUsername(userToken.getUser().getEmail());
                Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());

                String newToken = jwtUtil.createJwt(authentication);
                userToken.setAccessToken(newToken);
                customUserDetailsService.saveRefreshToken(userToken);

                token = newToken;
            }
        }

        if (jwtUtil.validateToken(token)) {
            // 스프링 시큐리티 인증 토큰 생성
            Authentication authentication = jwtUtil.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            response.setHeader("Bearer_Token", token);
        } else {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않은 토큰입니다.");
            return;
        }

        // 다음 필터로 request, response 넘겨줌
        filterChain.doFilter(request, response);
    }

}