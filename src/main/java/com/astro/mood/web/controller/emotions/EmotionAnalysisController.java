package com.astro.mood.web.controller.emotions;

import com.astro.mood.service.emotions.EmotionAnalysisService;
import com.astro.mood.web.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EmotionAnalysisController {

    private final EmotionAnalysisService emotionAnalysisService;

    @GetMapping("/analysis")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalysisByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam String period // yearly, monthly, weekly, daily
    ) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        Map<String, Object> analysisResults = emotionAnalysisService.analyzeByPeriod(startDateTime, endDateTime, period);

        return ResponseEntity.ok(ApiResponse.ok(analysisResults));
    }
}