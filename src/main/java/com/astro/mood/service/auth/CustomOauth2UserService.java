package com.astro.mood.service.auth;

import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.repository.auth.AuthRepository;
import com.astro.mood.security.login.CustomOauth2UserDetails;
import com.astro.mood.security.login.GoogleUserDetails;
import com.astro.mood.security.login.OAuth2UserInfo;
import com.astro.mood.web.dto.auth.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOauth2UserService extends DefaultOAuth2UserService {

    private final AuthRepository authRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("getAttributes : {}",oAuth2User.getAttributes());

        String provider = userRequest.getClientRegistration().getRegistrationId();

        OAuth2UserInfo oAuth2UserInfo = null;

        // 뒤에 진행할 다른 소셜 서비스 로그인을 위해 구분 => 구글
        if(provider.equals("google")){
            log.info("구글 로그인");
            oAuth2UserInfo = new GoogleUserDetails(oAuth2User.getAttributes());

        }

        String providerId = oAuth2UserInfo.getProviderId();
        String email = oAuth2UserInfo.getEmail();
        String loginId = provider + "_" + providerId;
        String name = oAuth2UserInfo.getName();
        Optional<User> findUser = authRepository.findUserByOauthIdAndOauthProvider(providerId, provider);
        User user;

        if (findUser.isEmpty()) {
            user = User.builder()
                    .email(email)
                    .nickname(name)
                    .authorities(new HashSet<>(List.of(UserRole.ROLE_USER)))
                    .isDeleted(false)
                    .oauthId(providerId)
                    .oauthProvider(provider.toUpperCase())
                    .build();
            authRepository.save(user);
        } else{
            user = findUser.get();
        }

        return new CustomOauth2UserDetails(user, oAuth2User.getAttributes());
    }
}