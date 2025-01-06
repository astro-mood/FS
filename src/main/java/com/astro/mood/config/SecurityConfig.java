package com.astro.mood.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // Spring Security 기능을 활성화합니다.
public class SecurityConfig  {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().permitAll() // 모든 요청 허용
                        /**
                         .antMatchers("/public/**").permitAll() // /public/** 경로는 인증 없이 접근 가능
                         .antMatchers("/admin/**").authenticated() // /admin/** 경로는 인증 필요
                         .anyRequest().permitAll() // 나머지 요청은 허용
                         * */
                )
                .csrf(csrf -> csrf.disable()); // CSRF 보호 비활성화 (필요에 따라)


        return http.build();
    }
}