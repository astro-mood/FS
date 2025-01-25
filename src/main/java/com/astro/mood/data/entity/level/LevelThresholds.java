package com.astro.mood.data.entity.level;

import jakarta.persistence.*;
import lombok.*;


@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "level_thresholds")
public class LevelThresholds {
    @Id
    @Column(name = "level")
    private Integer level;

    @Column(name = "threshold")
    private Integer threshold;
}
