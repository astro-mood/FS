package com.astro.mood.web.controller.emotions;

import com.astro.mood.service.emotions.EmotionAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EmotionAnalysisController {

    private final EmotionAnalysisService emotionAnalysisService;

    @PostMapping("/analysis")
    public ResponseEntity<String> runAnalysis(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        emotionAnalysisService.analyzeAndStore(startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        return ResponseEntity.ok("감정분석을 성공했습니다.");
    }
}