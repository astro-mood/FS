package com.astro.mood.web.dto.auth;

import com.astro.mood.data.entity.user.User;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfoResponse {
    private Integer userIdx;
    private String nickname;
    private String profileImage;
    private String email;
    private String phone;
    private String oauthProvider;


    public UserInfoResponse(User user) {
        this.userIdx = user.getUserIdx();
        this.nickname = user.getNickname();
        this.profileImage = user.getProfileImage();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.oauthProvider = user.getOauthProvider();
    }
    public static UserInfoResponse from(User user) {return new UserInfoResponse(user);}
}
