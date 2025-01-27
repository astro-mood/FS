package com.astro.mood.data.entity.notice;

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
@Table(name = "notice")
public class Notice {
    @Id
    @Column(name = "notice_idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer noticeIdx;

    @Column(name = "user_idx")
    private Integer userIdx;

    @Column(name = "wc_idx")
    private Integer wcIdx;

    @Column(name = "worry_idx")
    private Integer worryIdx;

    @Column(name = "is_read")
    private Boolean isRead;

    @Column(name = "type")
    private String type;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
