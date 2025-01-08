package com.astro.mood.service.auth;


import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.repository.auth.AuthRepository;
import com.astro.mood.service.exception.CustomException;
import com.astro.mood.service.exception.ErrorCode;
import com.astro.mood.service.s3Image.AwsS3Service;
import com.astro.mood.web.dto.auth.SignRequest;
import com.astro.mood.web.dto.auth.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final AuthRepository authRepository;
    private final AwsS3Service awsS3Service;


    @Transactional(transactionManager = "tmJpa")
    public boolean signUp(SignRequest signUpRequest) {
        String email = signUpRequest.getEmail();
        String nickname = signUpRequest.getNickName();
        String phone = signUpRequest.getPhone();
        MultipartFile profileImage = signUpRequest.getProfileImage();


        String profileImageUrl=null;
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                profileImageUrl = awsS3Service.uploadImageToS3(profileImage);
            } catch (IOException e) {
                throw new CustomException(ErrorCode.S3_UPLOAD_IO_ERROR);
            }
        }

        User userPrincipal = User.builder()
                .email(email)
                .nickname(nickname)
                .phone(phone)
                .profileImage(profileImageUrl)
                .authorities(new HashSet<>(List.of(UserRole.USER)))
                .isDeleted(false)
                .oauthId(signUpRequest.getOauthId())
                .oauthProvider(signUpRequest.getOauthProvider())
                .build();

        authRepository.save(userPrincipal);
        return true;
    }
}
