package com.astro.mood.data.repository.auth;

import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.entity.user.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserTokenRepository extends JpaRepository<UserToken,Integer> {

    UserToken findByUser(User user);

}
