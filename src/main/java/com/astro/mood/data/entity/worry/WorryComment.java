package com.astro.mood.data.entity.worry;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "worry_comment")
public class WorryComment {
    @Id
    @Column(name = "comment_idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer commentIdx;

    @Column(name="user_idx")
    private Integer userIdx;

    @Column(name="worry_idx")
    private Integer worryIdx;

    @Column(name = "content")
    private String content;

    @Column(name = "is_reported")
    private Boolean isReported;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @Column(name = "like_count")
    private int likeCount;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private WorryComment parentComment; //부모 댓글

    @JsonIgnore // 순환 참조 방지
    @OneToMany(mappedBy = "parentComment", fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private List<WorryComment> childrenComment = new ArrayList<>(); //자식 댓글들(대댓글)

}
