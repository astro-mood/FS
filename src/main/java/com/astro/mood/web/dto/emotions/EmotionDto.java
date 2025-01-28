package com.astro.mood.web.dto.emotions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmotionDto {
    private String period;        // x
    private float averageScore;   // y
    private float averageFrequency; // r
    private int emotionIdx;

    private java.time.LocalDate sortKey;
}