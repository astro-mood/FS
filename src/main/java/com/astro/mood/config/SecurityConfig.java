package com.astro.mood.config;

import com.astro.mood.security.jwt.GoogleLoginFilter;
import com.astro.mood.security.jwt.JWTFilter;
import com.astro.mood.security.jwt.JWTUtil;
import com.astro.mood.service.auth.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.header.HeaderWriter;
import org.springframework.security.web.header.HeaderWriterFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService; // UserDetailsService 추가

    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .headers(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)// 폼 로그인 비활성화
                .csrf(AbstractHttpConfigurer::disable) // CSRF 보호 비활성화
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .httpBasic(AbstractHttpConfigurer::disable) // HTTP Basic 인증 비활성화
                .rememberMe(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/**","/resources/static/**").permitAll() // 루트 경로 허용
                        .requestMatchers("/api/auth/google").permitAll() // 구글 로그인 경로 허용
                        .requestMatchers("/swagger-resources/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll() // Swagger 관련 경로 허용
                        .requestMatchers("/test/**").hasAuthority("ROLE_USER")
                        .requestMatchers("/main","/api/worry/**", "/api/diary/**","/api/emotions/**","/api/likes/**").hasAuthority("ROLE_USER")
                        .anyRequest().permitAll()
                )
                .sessionManagement(sessionManagement -> sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)// 세션 상태 비활성화
                )
                .addFilterBefore(new GoogleLoginFilter(
                        "/api/auth/google", authenticationManager(), jwtUtil, customUserDetailsService
                        )
                        ,UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new JWTFilter(jwtUtil, customUserDetailsService), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    //프론트 엔드에서 백엔드로 요청보낼 때, cors 오류를 방지 하기 위함.
    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000","http://localhost:8080"
        ));
        configuration.setAllowCredentials(true);
        configuration.addExposedHeader("Bearer_Token");
        configuration.addExposedHeader("Authorization");
        configuration.addAllowedHeader("Authorization");
        configuration.addAllowedHeader("Content-Type");
//        configuration.addAllowedHeader("*");
        configuration.setAllowedMethods(Arrays.asList("GET", "PUT", "POST", "DELETE", "PATCH"));
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}