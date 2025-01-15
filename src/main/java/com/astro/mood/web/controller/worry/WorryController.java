package com.astro.mood.web.controller.worry;

import com.astro.mood.web.dto.worry.WorryDto;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.astro.mood.service.worry.WorryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class WorryController {

    private final WorryService worryService;

    public WorryController(WorryService worryService) {
        this.worryService = worryService;
    }

    //고민글 작성하기
    @PostMapping("/writeworry")
    public ResponseEntity<WorryDto.Response> createWorry(@RequestBody WorryDto.CreateRequest request) {
        WorryDto.Response response = worryService.createWorry(request);
        return ResponseEntity.ok(response);
    }

    //고민글 상세보기
    @GetMapping("/worry/{worry_idx}")
    public ResponseEntity<WorryDto.Response> getWorry(@PathVariable Integer worry_idx) {
        WorryDto.Response response = worryService.getWorryByIdx(worry_idx);
        return ResponseEntity.ok(response);
    }

    //고민글 전부 가져오기
    @GetMapping("/worry")
    public ResponseEntity<List<WorryDto.Response>> getAllWorries() {
        List<WorryDto.Response> worries = worryService.getAllWorries();
        return ResponseEntity.ok(worries);
    }

    //고민글 삭제
    @DeleteMapping("/worry/{worry_idx}")
    public ResponseEntity<Void> deleteWorry(@PathVariable Integer worry_idx) {
        worryService.deleteWorry(worry_idx);
        return ResponseEntity.noContent().build();
    }

    //고민글 수정
    @PutMapping("/worry/{worry_idx}")
    public ResponseEntity<WorryDto.Response> updateWorry(
            @PathVariable Integer worry_idx,
            @RequestBody WorryDto.UpdateRequest request) {
        WorryDto.Response response = worryService.updateWorry(worry_idx, request);
        return ResponseEntity.ok(response);
    }

    //고민글 상태 변화
    @PatchMapping("/worry/{worryIdx}/resolve")
    public ResponseEntity<WorryDto.Response> changeResolveStatus(
            @PathVariable Integer worryIdx,
            @RequestBody WorryDto.ResolveChangeRequest request) {
        WorryDto.Response response = worryService.changeResolveStatus(worryIdx, request);
        return ResponseEntity.ok(response);
    }
}
