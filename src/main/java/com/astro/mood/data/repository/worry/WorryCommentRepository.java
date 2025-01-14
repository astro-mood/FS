package com.astro.mood.data.repository.worry;

import com.astro.mood.data.entity.worry.WorryComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorryCommentRepository  extends JpaRepository<WorryComment,Integer> {
}
