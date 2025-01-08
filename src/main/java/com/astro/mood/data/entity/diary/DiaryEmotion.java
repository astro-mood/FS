package com.astro.mood.data.entity.diary;

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


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_idx")
    private User user;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
