package com.astro.mood.data.repository.likes;

import com.astro.mood.data.entity.likes.Likes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikesRepository extends JpaRepository<Likes,Integer> {
}
