package com.astro.mood.data.repository.auth;

import com.astro.mood.data.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<User,Integer> {

    Optional<User> findUserByOauthIdAndOauthProviderAndIsDeleted(String oauthId, String oauthProvider, Boolean  isDeleted);

    Optional<User>  findUserByEmailAndIsDeleted(String email, Boolean isDeleted);
}
