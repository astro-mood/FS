package com.astro.mood.service.auth;


import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.repository.auth.AuthRepository;
import com.astro.mood.security.login.CustomUserDetails;
import com.astro.mood.service.exception.CustomException;
import com.astro.mood.service.exception.ErrorCode;
import com.astro.mood.web.dto.auth.UserInfoRequest;
import com.astro.mood.web.dto.auth.UserInfoResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final AuthRepository authRepository;

    // 유저 검증 메서드
    public void validateUser(CustomUserDetails userDetails, Integer loginIdx) {
        if (userDetails == null) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
        if (!userDetails.getUserIdx().equals(loginIdx)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
    }


    // 사용자 찾기 메서드
    private User findUserByIdOrThrow(Integer userIdx) {
        return authRepository.findById(userIdx)
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));
    }

    //유저정보 수정
    @Transactional(transactionManager = "tmJpa")
    public UserInfoResponse putUserInfo(UserInfoRequest userInfoRequest, String newImageUrl) {
        User user = findUserByIdOrThrow(userInfoRequest.getUserIdx());
        user.updateProfileImage(newImageUrl);
        user.updateNickname(userInfoRequest.getNickname());
        user.updatePhone(userInfoRequest.getPhone());

        return UserInfoResponse.from(user);
    }

    //유저정보 가져오기
    public UserInfoResponse getUserInfo(Integer loginIdx) {
        User user = findUserByIdOrThrow(loginIdx);
        return UserInfoResponse.from(user);
    }

}
