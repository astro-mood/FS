package com.astro.mood.data.entity.diary;

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
@Table(name = "diary_comment")
public class DiaryComment {
    @Id
    @Column(name = "dc_idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer dcIdx;

    @Column(name = "diary_idx")
    private Integer diaryIdx;

    @Column(name="content")
    private String content;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
