package com.astro.mood.web.controller.diary;

import com.astro.mood.service.diary.DiaryService;
import com.astro.mood.web.dto.diary.DiaryDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DiaryController {

    private final DiaryService diaryService;

    public DiaryController(DiaryService diaryService) {
        this.diaryService = diaryService;
    }

    // 일기쓰기
    @PostMapping("/writediary")
    public ResponseEntity<DiaryDto.Response> createDiary(@RequestBody DiaryDto.CreateRequest request) {
        DiaryDto.Response response = diaryService.createDiary(request);
        return ResponseEntity.ok(response);
    }

    // 달력으로 내가 쓴 일기 가져오기
    @GetMapping("/mydiary")
    public List<DiaryDto.CalendarResponse> getDiaryCalendar(
            @RequestParam("year") Integer year,
            @RequestParam("month") Integer month) {
        return diaryService.getDiaryCalendar(year, month);
    }

    // 일기 상세보기
    @GetMapping("/diary/{diary_idx}")
    public ResponseEntity<DiaryDto.Response> getDiary(@PathVariable Integer diary_idx) {
        DiaryDto.Response response = diaryService.getDiaryByIdx(diary_idx);
        return ResponseEntity.ok(response);
    }

    // 일기 삭제
    @DeleteMapping("/diary/{diary_idx}")
    public ResponseEntity<Void> deleteDiary(@PathVariable Integer diary_idx) {
        diaryService.deleteDiary(diary_idx);
        return ResponseEntity.noContent().build();
    }

    // 일기 수정
    @PutMapping("/diary/{diary_idx}")
    public ResponseEntity<DiaryDto.Response> updateDiary(
            @PathVariable Integer diary_idx,
            @RequestBody DiaryDto.UpdateRequest updateRequest) {
        DiaryDto.Response response = diaryService.updateDiary(diary_idx, updateRequest);
        return ResponseEntity.ok(response);
    }
}
