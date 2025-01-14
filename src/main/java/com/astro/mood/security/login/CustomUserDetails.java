package com.astro.mood.security.login;

import com.astro.mood.web.dto.auth.UserRole;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomUserDetails  implements UserDetails {
    private Integer userIdx;
    private String nickname;
    private String email;
    private String profileImage;
    private Set<UserRole> authorities;


    public Integer getUserIdx() {
        return userIdx;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities.stream().map(UserRole::name).map(SimpleGrantedAuthority::new).collect(Collectors.toSet());
    }
    public Set<UserRole> getAuthoritySet() {
        return authorities;
    }
    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return this.email;
    }

}
