package com.astro.mood.security.jwt;

import com.astro.mood.security.login.CustomUserDetails;
import io.jsonwebtoken.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Component
public class JWTUtil {
    private SecretKey secretKey;
    @Value("${jwt.secret}") private String secret;
    @Value("${jwt.expiration_time}")
    private long accessTokenExpTime;
    private final UserDetailsService userDetailsService;

    // @Value : application.yml에서의 특정한 변수 데이터를 가져올 수 있음
    // string key는 jwt에서 사용 안하므로 객체 키 생성!
    // "${spring.jwt.secret}" : application.yml에 저장된 spring: jwt: secret 에 저장된 암호화 키 사용
    @PostConstruct
    public void setUp( ) {
        // 주입받은 secret 키를 SecretKeySpec 객체로 변환하여 secretKey 변수에 저장
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS256.getJcaName());
    }


    //이메일 반환 메서드
    private String getUserEmail(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(secretKey)
//                .build()
//                .parseClaimsJws(token)
//                .getBody()
//                .getSubject();

        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
        return claims.get("email", String.class);
    }

    // loginIdx 반환 메서드
    public Integer getLoginIdx(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
        return claims.get("loginIdx", Integer.class);
    }

    // role 반환 메서드
    public String getRole(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
        return claims.get("role", String.class);
    }
    // nickname 반환 메서드
    public String getNickname(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
        return claims.get("nickname", String.class);
    }


    // 토큰이 소멸 (유효기간 만료) 하였는지 검증 메서드
    public Boolean isExpired(String token) {
         try {
            Claims claims = Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            // 토큰이 만료된 경우
            return true;
        } catch (Exception e) {
            return false; // 잘못된 토큰인 경우 false 반환
        }
    }

    // 토큰 생성 메서드
    public String createJwt(Authentication loginInfo) {
        CustomUserDetails user = (CustomUserDetails) loginInfo.getPrincipal();
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        // role 추출
//        Collection<? extends GrantedAuthority> authorities = loginInfo.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //email, userIdx, role, nickname 이 들어가도록 수정하기
        return Jwts.builder()
                .claim("loginIdx", user.getUserIdx())
                .claim("nickname", user.getNickname())
                .claim("email", user.getEmail())
                .claim("profileImage", user.getProfileImage())
                .claim("role", role)
                .setIssuedAt(new Date(System.currentTimeMillis())) // 토큰 현재 발행 시간 설정
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpTime)) //토큰 소멸 시간 설정
                .signWith(secretKey) //주입한 secret key를 통해서 암호화 진행
                .compact(); //토큰을 compact 해서 리턴
    }

    //구글 idToken 검증
    public Map<String, Object> verifyIdToken(String idToken) {
        RestTemplate restTemplate = new RestTemplate();
        String googleVerifyUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;

        // ID 토큰 검증
        return restTemplate.getForObject(googleVerifyUrl, Map.class);
    }


    //토큰검정하기
    public boolean validateToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Date now = new Date();
            return claims.getExpiration().after(now);
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info("잘못된 JWT 서명입니다: {}", e.getMessage());
            return false;
        } catch (ExpiredJwtException e) {
            log.info("만료된 JWT 토큰입니다: {}", e.getMessage());
            return false;
        } catch (UnsupportedJwtException e) {
            log.info("지원되지 않는 JWT 토큰입니다: {}", e.getMessage());
            return false;
        } catch (IllegalArgumentException e) {
            log.info("JWT 토큰이 잘못되었습니다: {}", e.getMessage());
            return false;
        }
    }

    //refresh 토큰 생성 메서드
    public String createRefreshToken(Integer loginId) {
        return Jwts.builder()
                .claim("loginIdx", loginId)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+accessTokenExpTime*30))
                .signWith(secretKey)
                .compact();
    }

    //스프링 시큐리티 인증 토큰 생성
    public Authentication getAuthentication(String token) {
        String email = getUserEmail(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }


    //토큰 생성 - email로 생성
    public String createJwtEmail(String loginId, String role) {
        return Jwts.builder()
                .claim("loginIdx", loginId)
                .claim("role", role)
                .setIssuedAt(new Date(System.currentTimeMillis())) // 토큰 현재 발행 시간 설정
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpTime)) //토큰 소멸 시간 설정
                .signWith(secretKey) //주입한 secret key를 통해서 암호화 진행
                .compact(); //토큰을 compact 해서 리턴
    }

    //refresh 토큰 생성 메서드 - email로 생성
    public String createRefreshTokenEmail(String loginId) {
        return Jwts.builder()
                .claim("loginIdx", loginId)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+accessTokenExpTime*30))
                .signWith(secretKey)
                .compact();
    }


}
