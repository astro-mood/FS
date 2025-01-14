package com.astro.mood.service.auth;
import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.entity.user.UserToken;
import com.astro.mood.data.repository.auth.AuthRepository;
import com.astro.mood.data.repository.auth.UserTokenRepository;
import com.astro.mood.security.login.CustomUserDetails;
import com.astro.mood.web.dto.auth.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AuthRepository authRepository;
    private final UserTokenRepository userTokenRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User userPrincipal = authRepository.findUserByEmailAndIsDeleted(email, false).orElseThrow(()
                -> new UsernameNotFoundException("email 에 해당하는 UserPrincipal가 없습니다"));

        Set<UserRole> roles = userPrincipal.getAuthorities();

        return CustomUserDetails.builder()
                .userIdx(userPrincipal.getUserIdx())
                .email(userPrincipal.getEmail())
                .profileImage(userPrincipal.getProfileImage())
                .nickname(userPrincipal.getNickname())
                .authorities(roles)
                .build();

    }

    //CustomUserDetails 생성
    public UserDetails loadUser(Map<String, Object> userInfo, String provider) throws UsernameNotFoundException {
        String email = userInfo.get("email").toString();
        String providerId = userInfo.get("sub").toString();
        String picture = userInfo.get("picture").toString();
        String name = userInfo.get("name").toString();

        Optional<User> findUser = authRepository.findUserByOauthIdAndOauthProviderAndIsDeleted(providerId, provider, false);
        User userPrincipal;
        if (findUser.isEmpty() ) {
            //유저정보가 없으면 회원가입
            userPrincipal = User.builder()
                    .email(email)
                    .nickname(name)
                    .authorities(new HashSet<>(List.of(UserRole.ROLE_USER)))
                    .isDeleted(false)
                    .profileImage(picture)
                    .oauthId(providerId)
                    .oauthProvider(provider)
                    .build();
            authRepository.save(userPrincipal);
        } else{
            userPrincipal = findUser.get();
        }

        return CustomUserDetails.builder()
                .userIdx(userPrincipal.getUserIdx())
                .email(userPrincipal.getEmail())
                .nickname(userPrincipal.getNickname())
                .profileImage(userPrincipal.getProfileImage())
                .authorities(userPrincipal.getAuthorities())
                .build();

    }

    //유저토큰 가져오기
    public UserToken findUserToken(Integer userIdx) {
        User user = User.builder().userIdx(userIdx).build();
        return userTokenRepository.findByUser(user);
    }

    //리프레시토큰 생성/업데이트
    @Transactional(transactionManager = "tmJpa")
    public void saveRefreshToken(UserToken newRefreshToken) {
        UserToken findUserToken = userTokenRepository.findByUser(newRefreshToken.getUser());
        if(findUserToken == null){
            userTokenRepository.save(newRefreshToken);
        }else{
            userTokenRepository.updateUserTokenByTokenIdx(newRefreshToken.getTokenIdx(),newRefreshToken.getRefreshToken(),newRefreshToken.getExpiresAt());
        }
    }


}