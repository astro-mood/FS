package com.astro.mood.data.repository.likes;

import com.astro.mood.data.entity.likes.Likes;
import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.entity.worry.WorryComment;
import jakarta.persistence.TypedQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LikesRepository extends JpaRepository<Likes,Integer> {

    Optional<Likes> findByWorryCommentAndUser(WorryComment worryComment, User user);

    @Query("SELECT COUNT(l) > 0  FROM Likes l WHERE l.user.userIdx = :userIdx AND l.worryComment.commentIdx = :worryCommentIdx")
    boolean existsByUserIdxAndWorryCommentIdx(@Param("userIdx") Integer userIdx, @Param("worryCommentIdx") Integer worryCommentIdx);

}
