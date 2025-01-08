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
@Table(name = "emotion_analysis")
public class EmotionAnalysis {
    @Id
    @Column(name = "Analysis_idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer AnalysisIdx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_idx")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "most_frequent_emotion")
    private Emotions emotions;

    @Column(name = "average_score")
    private Float averageScore;

    @Column(name = "recommendation")
    private String recommendation;

    @Column(name = "start_date")
    private LocalDateTime startDate;
    @Column(name = "end_date")
    private LocalDateTime endDate;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
