package com.astro.mood.data.entity.worry;

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
@Table(name = "worry_comment_reports")
public class WorryCommentReport {
    @Id
    @Column(name = "report_idx")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reportIdx;

    @Column(name="user_idx")
    private Integer userIdx;

    @Column(name = "comment_idx")
    private Integer commentIdx;

    @Column(name = "report_reason")
    private String reportReason;

    @CreationTimestamp
    @Column(name = "reported_at")
    private LocalDateTime reportedAt;

    public static WorryCommentReport from(Integer userIdx, WorryComment reportComment) {
        WorryCommentReport report = new WorryCommentReport();
        report.userIdx =userIdx;
        report.commentIdx =reportComment.getCommentIdx();
        report.reportReason =reportComment.getContent();
        return report;
    }

}
