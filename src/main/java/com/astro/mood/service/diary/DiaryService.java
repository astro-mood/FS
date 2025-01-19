package com.astro.mood.service.diary;

import com.astro.mood.data.entity.diary.Diary;
import com.astro.mood.data.entity.diary.DiaryEmotion;
import com.astro.mood.data.entity.emotion.Emotions;
import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.repository.auth.AuthRepository;
import com.astro.mood.data.repository.diary.DiaryEmotionRepository;
import com.astro.mood.data.repository.diary.DiaryRepository;
import com.astro.mood.data.repository.emotions.EmotionsRepository;
import com.astro.mood.security.login.CustomUserDetails;
import com.astro.mood.web.dto.diary.DiaryDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional(readOnly = true)
public class DiaryService {

    // 사용자 인증 -> 공통로직을 뺌.
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            throw new RuntimeException("인증된 사용자를 찾을 수 없습니다.");
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer userIdx = userDetails.getUserIdx();

        return authRepository.findById(userIdx)
                .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));
    }

    private final DiaryRepository diaryRepository;
    private final DiaryEmotionRepository diaryEmotionRepository;
    private final AuthRepository authRepository;
    private final EmotionsRepository emotionsRepository; // 필드 추가

    public DiaryService(DiaryRepository diaryRepository,
                        DiaryEmotionRepository diaryEmotionRepository,
                        AuthRepository authRepository,
                        EmotionsRepository emotionsRepository) {
        this.diaryRepository = diaryRepository;
        this.diaryEmotionRepository = diaryEmotionRepository;
        this.authRepository = authRepository;
        this.emotionsRepository = emotionsRepository;
    }

    // 일기쓰기
    @Transactional
    public DiaryDto.Response createDiary(DiaryDto.CreateRequest request) {

        // 사용자 인증
        User user = getAuthenticatedUser();

        // Diary 엔티티 생성, 저장
        Diary diary = Diary.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .user(user) // user 정보 가져오기
                .build();
        Diary savedDiary = diaryRepository.save(diary);

        // 감정 리스트로 처리
        List<DiaryEmotion> emotions = request.getEmotions().stream().map(data -> {

            // Emotions 엔티티를 조회하여 emotionIdx 가져와서 저장
            Emotions emotion = emotionsRepository.findById(data.getEmotionIdx())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 감정입니다."));

            // DiaryEmotion 생성, 저장
            return DiaryEmotion.builder()
                    .diary(diary)
                    .userScore(data.getUserScore())
                    .emotions(emotion)
                    .build();
        }).collect(Collectors.toList());
        diaryEmotionRepository.saveAll(emotions);

        return DiaryDto.Response.fromEntity(diary, emotions);
    }

    // 사용자 일기 조회 (달력 형식)
    @Transactional(readOnly = true)
    public List<DiaryDto.CalendarResponse>getDiaryCalendar(Integer year, Integer month) {
        User user = getAuthenticatedUser();

        // 해당 월에 작성한 일기 조회
        List<Diary> diaries = diaryRepository.findByUserAndMonth(user, year, month);

        return diaries.stream()
                .map(diary -> {
                            List<DiaryEmotion> diaryEmotions = diaryEmotionRepository.findByDiary(diary);

                    // 감정 리스트로 처리
                    List<DiaryDto.CalendarEmotion> emotions = diaryEmotions.stream()
                            .map(emotion -> new DiaryDto.CalendarEmotion(
                                    emotion.getEmotions().getEmotionIdx(),
                                    emotion.getEmotions().getEmoji(),
                                    emotion.getUserScore()
                            ))
                            .collect(Collectors.toList());

                    return new DiaryDto.CalendarResponse(
                            diary.getDiaryIdx(),
                            diary.getCreatedAt().toLocalDate(),
                            emotions);
                })
                .collect(Collectors.toList());
    }

    // 일기상세보기
    @Transactional(readOnly = true)
    public DiaryDto.Response getDiaryByIdx(Integer diaryIdx) {
        Diary diary = diaryRepository.findById(diaryIdx)
                .orElseThrow(() -> new RuntimeException("Diary not found"));

        //감정정보 반환
        List<DiaryEmotion> emotions = diaryEmotionRepository.findByDiary(diary);

        return DiaryDto.Response.fromEntity(diary, emotions);
    }

    // 일기 삭제
    @Transactional
    public void deleteDiary(Integer diaryIdx) {
        Diary diary = diaryRepository.findById(diaryIdx)
                .orElseThrow(() -> new RuntimeException("Diary not found"));
        diaryRepository.delete(diary);
    }

    // 일기 수정
    @Transactional
    public DiaryDto.Response updateDiary(Integer diaryIdx, DiaryDto.UpdateRequest updateRequest) {
        Diary diary = diaryRepository.findById(diaryIdx)
                .orElseThrow(() -> new RuntimeException("Diary not found"));

        diary.setTitle(updateRequest.getTitle());
        diary.setContent(updateRequest.getContent());

        // 기존 감정 삭제
        diaryEmotionRepository.deleteByDiary(diary);

        // 새로운 감정 저장
        updateRequest.getEmotions().forEach(emotionData -> {
            Emotions emotion = emotionsRepository.findById(emotionData.getEmotionIdx())
                    .orElseThrow(() -> new RuntimeException("Emotion not found"));

            DiaryEmotion diaryEmotion = DiaryEmotion.builder()
                    .diary(diary)
                    .emotions(emotion)
                    .userScore(emotionData.getUserScore())
                    .build();

            diaryEmotionRepository.save(diaryEmotion);
            log.info("Saved diary emotion: {}", diaryEmotion);

        });

        return DiaryDto.Response.fromEntity(diary, diaryEmotionRepository.findByDiary(diary));
    }
}
