package com.astro.mood.web.dto.auth;

import com.astro.mood.data.entity.user.User;
import lombok.Getter;

import java.util.Set;

@Getter
public class CustomUserInfoDto  {
    private String nickname;
    private int userIdx;
    private Set<UserRole> authorities;
}
