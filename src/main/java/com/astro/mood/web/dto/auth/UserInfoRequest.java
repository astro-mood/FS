package com.astro.mood.web.dto.auth;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfoRequest {
    private Integer userIdx;

    @NotEmpty(message = "닉네임은 필수입니다.")
    private String nickname;
    private MultipartFile profileImage;

    private String phone;

}
