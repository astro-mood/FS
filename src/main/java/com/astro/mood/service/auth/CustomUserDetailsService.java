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
        User userPrincipal = authRepository.findUserByEmail(email).orElseThrow(()
                -> new UsernameNotFoundException("email 에 해당하는 UserPrincipal가 없습니다"));

        Set<UserRole> roles = userPrincipal.getAuthorities();

        return CustomUserDetails.builder()
                .userIdx(userPrincipal.getUserIdx())
                .email(userPrincipal.getEmail())
                .nickname(userPrincipal.getNickname())
                .authorities(roles)
                .build();

    }

    public UserDetails loadUser(Map<String, Object> userInfo, String provider) throws UsernameNotFoundException {
        String email = userInfo.get("email").toString();
        String providerId = userInfo.get("sub").toString();
        String picture = userInfo.get("picture").toString();
        String name = userInfo.get("name").toString();

        Optional<User> findUser = authRepository.findUserByOauthIdAndOauthProvider(providerId, provider);
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
                .authorities(userPrincipal.getAuthorities())
                .build();

    }

    public UserToken findUserToken(CustomUserDetails userDetails) {
        User user = User.builder().userIdx(userDetails.getUserIdx()).build();
        return userTokenRepository.findByUser(user);
    }

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