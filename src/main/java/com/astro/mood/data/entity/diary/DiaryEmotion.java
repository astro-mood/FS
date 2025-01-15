package com.astro.mood.data.entity.diary;

import com.astro.mood.data.entity.emotion.Emotions;
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
@Table(name = "diary_emotion")
public class DiaryEmotion {
    @Id
    @Column(name = "de_idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer deIdx;

    @Column(name = "diary_idx")
    private Integer diaryIdx;

    @Column(name = "user_score")
    private int userScore;

    @Column(name = "api_score")
    private Float apiScore;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emotion_idx")
    private Emotions emotions;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
