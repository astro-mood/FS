package com.astro.mood.data.repository.likes;

import com.astro.mood.data.entity.likes.Likes;
import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.entity.worry.WorryComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikesRepository extends JpaRepository<Likes,Integer> {

    Optional<Likes> findByWorryCommentAndUser(WorryComment worryComment, User user);
}
