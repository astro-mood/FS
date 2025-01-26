package com.astro.mood.service.emotions;
import com.astro.mood.data.entity.diary.DiaryEmotion;
import com.astro.mood.data.entity.emotion.EmotionAnalysis;
import com.astro.mood.data.entity.emotion.Emotions;
import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.repository.auth.AuthRepository;
import com.astro.mood.data.repository.diary.DiaryEmotionRepository;
import com.astro.mood.data.repository.emotions.EmotionAnalysisRepository;
import com.astro.mood.security.login.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Transactional
@Service
@RequiredArgsConstructor
@Slf4j
public class EmotionAnalysisService {

    private final DiaryEmotionRepository diaryEmotionRepository;
    private final AuthRepository authRepository;
    private final EmotionAnalysisRepository emotionAnalysisRepository;

    // 사용자 인증
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

    // 감정 분석 + DB 저장
    public void analyzeAndStore(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        User user = getAuthenticatedUser();

        // 기존 분석 결과 삭제
        emotionAnalysisRepository.deleteAnalysis(user, startDateTime, endDateTime);
        log.info("Delete data : user {} between {} and {}", user.getUserIdx(), startDateTime, endDateTime);

        // Diary의 createdAt 기준으로 DiaryEmotion 데이터를 가져오기 (diaryEmotion의 createdAt은 수정 기준으로 업데이트가 됨.)
        List<DiaryEmotion> diaryEmotions = emotionAnalysisRepository.findByDiaryCreatedAtForDiaryEmotion(user, startDateTime, endDateTime);

        if (diaryEmotions.isEmpty()) {
            log.info("No data : user {} between {} and {}", user.getUserIdx(), startDateTime, endDateTime);
            return;
        }

        // 감정별 그룹핑
        Map<Emotions, List<DiaryEmotion>> groupedByEmotion = diaryEmotions.stream()
                .collect(Collectors.groupingBy(DiaryEmotion::getEmotions));

        // 선택된 기간의 총 주 수 계산 -> 7일을 기준으로 빈도 평균값 계산하기 위해
        long days = java.time.Duration.between(startDateTime, endDateTime).toDays() + 1; // 전체 기간 + 1 = 총 일수
        double weeks = Math.ceil(days / 7.0); // 총 주 수 (올림 처리)

        // 가장 높은 감정
        Emotions highestEmotion = null;
        // 가장 높은 평균 점수
        double highestScore = 0; // 이 두개를 통해서 가장 높은 점수와 감정 저장

        // 감정별 평균 점수와 빈도 계산
        for (Map.Entry<Emotions, List<DiaryEmotion>> entry : groupedByEmotion.entrySet()) {
            Emotions emotion = entry.getKey();
            List<DiaryEmotion> emotionsList = entry.getValue(); // 해당 감정은 리스트로.

            // 평균 점수 계산
            double averageScore = emotionsList.stream()
                    .mapToInt(DiaryEmotion::getUserScore)
                    .average()
                    .orElse(0);

            // 평균 빈도 계산 (주 단위)
            double averageFrequency = emotionsList.size() / weeks;

            // 가장 높은 점수의 감정 확인 : 평균점수가 최고점수보다 높으면 최고점수로 갱신되고, 감정도 새로 업데이트됨.
            if (averageScore > highestScore) {
                highestScore = averageScore;
                highestEmotion = emotion;
            }

            // EmotionAnalysis 생성, 저장
            EmotionAnalysis analysis = EmotionAnalysis.builder()
                    .user(user)
                    .emotions(emotion)
                    .averageScore((float) averageScore)
                    .averageFrequency((float) averageFrequency)
                    .recommendation("")
                    .startDate(startDateTime)
                    .endDate(endDateTime)
                    .build();

                emotionAnalysisRepository.save(analysis);
            }

        // 가장 높은 점수의 감정에 recommendation 추가
        if (highestEmotion != null) {
            EmotionAnalysis highestAnalysis = emotionAnalysisRepository.findTopEmotion(
                    user, highestEmotion, startDateTime, endDateTime);

            if (highestAnalysis != null) {
                highestAnalysis.setRecommendation(Recommendation(highestEmotion));
                emotionAnalysisRepository.save(highestAnalysis);
            }
        }
    }

    // emotionIdx 기준 recommendation 문구
    private String Recommendation(Emotions emotion) {
        switch (emotion.getEmotionIdx()) {
            case 1:
                return "즐거운 시간을 보내셨네요! 앞으로도 활기찬 시간을 보내게 될 거예요.";
            case 2:
                return "설레는 일이 많으셨군요! 영화같은 순간이 더 생길 거예요.";
            case 3:
                return "안도할 일이 생기셨군요. 걱정은 기우일 때가 많답니다.";
            case 4:
                return "아무 일도 일어나지 않는 무의 상태도 좋은 상태랍니다.";
            case 5:
                return "슬픈 시간을 보내셨네요. 슬픈 마음은 흘려 보내세요.";
            case 6:
                return "불안한 시기를 겪고 계시네요. 걱정만큼 불안한 일은 일어나지 않을 거예요.";
            case 7:
                return "분노를 겪고 계시군요. 조금만 차분하게 세상을 바라보세요.";
            default:
                return "행복한 하루 되세요.";
        }
    }
}