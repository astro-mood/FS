package com.astro.mood.data.entity.emotion;

import com.astro.mood.data.entity.user.User;
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
@Table(name = "emotions")
public class Emotions {
    @Id
    @Column(name = "emotion_idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer emotionIdx;

    @Column(name = "emotion_name")
    private String emotion_name;

    @Column(name = "description")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "emotion_emoji")
    private String emoji;
}
