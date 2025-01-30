package com.astro.mood.web.controller.diary;

import com.astro.mood.service.diary.DiaryService;
import com.astro.mood.web.dto.ApiResponse;
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
    public ApiResponse<DiaryDto.Response> createDiary(@RequestBody DiaryDto.CreateRequest request) {
        DiaryDto.Response response = diaryService.createDiary(request);
        return ApiResponse.created(response);
    }

    // 달력으로 내가 쓴 일기 가져오기
    @GetMapping("/mydiary")
    public ResponseEntity<ApiResponse<List<DiaryDto.CalendarResponse>>> getDiaryCalendar(
            @RequestParam("year") Integer year,
            @RequestParam("month") Integer month) {
        List<DiaryDto.CalendarResponse> response = diaryService.getDiaryCalendar(year, month);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }


    // 일기 상세보기
    @GetMapping("/diary/{diary_idx}")
    public ApiResponse<DiaryDto.Response> getDiary(@PathVariable Integer diary_idx) {
        DiaryDto.Response response = diaryService.getDiaryByIdx(diary_idx);
        return ApiResponse.ok(response);
    }

    // 일기 삭제
    @DeleteMapping("/diary/{diary_idx}")
    public ApiResponse<Void> deleteDiary(@PathVariable Integer diary_idx) {
        diaryService.deleteDiary(diary_idx);
        return ApiResponse.ok(null);
    }

    // 일기 수정
    @PutMapping("/diary/{diary_idx}")
    public ApiResponse<DiaryDto.Response> updateDiary(
            @PathVariable Integer diary_idx,
            @RequestBody DiaryDto.UpdateRequest updateRequest) {
        DiaryDto.Response response = diaryService.updateDiary(diary_idx, updateRequest);
        return ApiResponse.ok(response);
    }

    // 최신 일기 3개 가져오기
    @GetMapping("/diary/latest")
    public ApiResponse<List<DiaryDto.LatestResponse>> getLatestDiaries() {
        List<DiaryDto.LatestResponse> response = diaryService.getLatestDiaries();
        return ApiResponse.ok(response);
    }
}
