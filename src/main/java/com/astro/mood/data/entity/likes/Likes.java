package com.astro.mood.data.entity.likes;

import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.entity.worry.WorryComment;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@Data
@Entity
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "likes")
public class Likes {
    @Id
    @Column(name = "like_idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer likeIdx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_idx")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_idx")
    private WorryComment worryComment;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
