package com.astro.mood.data.repository.auth;

import com.astro.mood.data.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<User,Integer> {

    Optional<User> findUserByOauthIdAndOauthProvider(String oauthId, String oauthProvider);
    Optional<User>  findUserByEmail(String email);
}
