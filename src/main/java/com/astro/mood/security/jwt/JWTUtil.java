package com.astro.mood.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {
    private SecretKey secretKey;
    @Value("${jwt.expiration_time}")
    private long accessTokenExpTime;

    // @Value : application.yml에서의 특정한 변수 데이터를 가져올 수 있음
    // string key는 jwt에서 사용 안하므로 객체 키 생성!
    // "${spring.jwt.secret}" : application.yml에 저장된 spring: jwt: secret 에 저장된 암호화 키 사용
    public JWTUtil(
                   @Value("${jwt.secret}") String secret
    ) {
        // 주입받은 secret 키를 SecretKeySpec 객체로 변환하여 secretKey 변수에 저장
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS256.getJcaName());
    }


    // loginId 반환 메서드
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
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
        return claims.getExpiration().before(new Date());
    }

    // 토큰 생성 메서드
    public String createJwt(String loginId, String role) {
        return Jwts.builder()
                .claim("loginIdx", loginId)
                .claim("role", role)
                .setIssuedAt(new Date(System.currentTimeMillis())) // 토큰 현재 발행 시간 설정
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpTime)) //토큰 소멸 시간 설정
                .signWith(secretKey) //주입한 secret key를 통해서 암호화 진행
                .compact(); //토큰을 compact 해서 리턴
    }


}
