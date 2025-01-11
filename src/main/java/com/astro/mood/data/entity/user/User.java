package com.astro.mood.data.entity.user;

import com.astro.mood.service.exception.CustomException;
import com.astro.mood.service.exception.ErrorCode;
import com.astro.mood.web.dto.auth.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.apache.commons.validator.EmailValidator;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;
import java.util.Set;

import static org.hibernate.validator.internal.util.Contracts.assertTrue;

@Data
@Entity
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "user")
public class User {
    @Id
    @Column(name = "user_idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userIdx;

    @Column(name = "email")
    private String email;
    @Column(name = "nickname", nullable = false)
    @NotEmpty(message = "닉네임은 필수입니다.")
    private String nickname;
    @Column(name = "profile_image")
    private String profileImage;
    @Column(name = "phone")
    private String phone;
    @Column(name = "oauth_provider", nullable = false)
    private String oauthProvider;
    @Column(name = "oauth_id", nullable = false)
    private String oauthId;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "is_deleted")
    private Boolean isDeleted;
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;


    @Builder.Default
    @Transient
    private Set<UserRole> authorities = Set.of(UserRole.ROLE_USER);

    //회원탈퇴
    public void deleteUser() {
        this.isDeleted = true;
        this.deletedAt = LocalDateTime.now();
    }


    //유저 정보 수정 책임분리 추가 ==============
    public void updateProfileImage(String newImageUrl) {
        if (newImageUrl != null) {
            this.profileImage = newImageUrl;
        }
    }

    public void updateNickname(String newName) {
        if (newName != null && !newName.isEmpty()) {
            if(newName.length() <= 20){
                this.nickname = newName;
            }else{
                throw new CustomException(ErrorCode.INVALID_VALUE_NICKNAME);
            }
        }
    }

    public void updatePhone(String newPhone) {
        if (newPhone != null  && !newPhone.isEmpty()) {
            if(newPhone.length() == 11){
                this.phone = newPhone;
            }else{
                throw new CustomException(ErrorCode.INVALID_VALUE_PHONE);
            }
        }
    }

    public void updateEmail(String newEmail) {
        if (newEmail != null  && !newEmail.isEmpty()) {
            boolean isEmailValid = EmailValidator.getInstance().isValid(newEmail);
            if (isEmailValid) {
                this.email = newEmail;
            }else{
                throw new CustomException(ErrorCode.INVALID_VALUE_EMAIL);
            }
        }
    }

}
