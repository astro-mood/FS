package com.astro.mood.service.emotions;
import com.astro.mood.data.entity.diary.Diary;
import com.astro.mood.data.entity.diary.DiaryEmotion;
import com.astro.mood.data.entity.emotion.Emotions;
import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.repository.auth.AuthRepository;
import com.astro.mood.data.repository.emotions.EmotionAnalysisRepository;
import com.astro.mood.security.login.CustomUserDetails;
import com.astro.mood.web.dto.emotions.EmotionDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Transactional
@Service
@RequiredArgsConstructor
@Slf4j
public class EmotionAnalysisService {

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

    // 감정 분석 + 기간별 데이터 반환
    public Map<String, Object> analyzeByPeriod(LocalDateTime startDate, LocalDateTime endDate, String period) {
        User user = getAuthenticatedUser();

        // Diary의 createdAt 기준으로 DiaryEmotion 데이터를 가져오기
        List<DiaryEmotion> diaryEmotions = emotionAnalysisRepository.findByDiaryCreatedAtForDiaryEmotion(user, startDate, endDate);

        if (diaryEmotions.isEmpty()) {
            log.info("No data : user {} between {} and {}", user.getUserIdx(), startDate, endDate);
            return Map.of("datasets", List.of(), "recommendation", "해당 기간에 데이터가 없습니다.");
        }

        // DiaryEmotion을 periodKey(1월, 1주, 1일)로 그룹화
        Map<String, List<DiaryEmotion>> periodGroups = diaryEmotions.stream()
                .collect(Collectors.groupingBy(de -> generatePeriodKey(
                        de.getDiary().getCreatedAt(), period
                )));

        // 데이터셋과 가장 높은 빈도 감정 저장
        List<EmotionDto> datasets = new ArrayList<>();
        EmotionDto highestFrequencyEmotion = null;

        // 기간으로 묶인 그룹에서 Emotion으로 또 묶어서 통계
        for (Map.Entry<String, List<DiaryEmotion>> entry : periodGroups.entrySet()) {
            String periodLabel = entry.getKey();  // 예: "2025년" / "3월" / "2025-12주" 등
            List<DiaryEmotion> group = entry.getValue();   // 해당 기간에 속한 DiaryEmotion 전부

            // period 그룹에서의 다이어리 갯수 구하기 (감정이 여러개여도 다이어리는 1번만 카운트)
            Set<Diary> uniqueDiaries = group.stream()
                    .map(DiaryEmotion::getDiary)
                    .collect(Collectors.toSet());
            int totalDiaryCount = uniqueDiaries.size();

            // 이 기간 그룹에서 감정별로 묶기
            Map<Emotions, List<DiaryEmotion>> emotionMap = group.stream()
                    .collect(Collectors.groupingBy(DiaryEmotion::getEmotions));

            for (Map.Entry<Emotions, List<DiaryEmotion>> emEntry : emotionMap.entrySet()) {
                Emotions emotion = emEntry.getKey();
                List<DiaryEmotion> emotionList = emEntry.getValue();

                // 평균 점수 계산
                float averageScore = (float) emotionList.stream()
                        .mapToInt(DiaryEmotion::getUserScore)
                        .average()
                        .orElse(0.0);

                // 빈도 계산 (emotionList.size = 감정 횟수) [frequency = 감정 수 / 해당 기간 다이어리 갯수]
                float frequency = (emotionList.size() / (float) totalDiaryCount) * 100f;

                // EmotionDto 객체 생성
                EmotionDto emotionDto = new EmotionDto(
                        periodLabel,
                        averageScore,
                        frequency,
                        emotion.getEmotionIdx());
                datasets.add(emotionDto);

                // 가장 높은 빈도 감정 갱신
                if (highestFrequencyEmotion == null
                        || emotionDto.getAverageFrequency() > highestFrequencyEmotion.getAverageFrequency()) {
                    highestFrequencyEmotion = emotionDto;
                }
            }
        }

        // Recommendation 문구 생성
        String recommendation = highestFrequencyEmotion != null
                ? emotionRecommendation(highestFrequencyEmotion.getEmotionIdx())
                : "recommendation 문구를 생성할 데이터가 없습니다.";

        return Map.of("datasets", datasets, "recommendation", recommendation);
    }

    // PeriodKey로 Label 만들기
    private String generatePeriodKey(LocalDateTime dateTime, String period) {
        LocalDate date = dateTime.toLocalDate();

        switch (period) {
            case "yearly":
                return date.getYear() + "년";

            case "monthly":
                return date.getMonthValue() + "월";

            case "weekly":
                int weekOfMonth = getWeekOfMonth(date);
                return date.getMonthValue() + "월" + weekOfMonth + "주";

            case "daily":
                return date.format(DateTimeFormatter.ofPattern("MM월 dd일"));

            default:
                return "Unknown";
        }
    }

    // month 기준으로 주차 계산 (월요일-일요일 1주)
    private int getWeekOfMonth(LocalDate date) {

        // 해당 month의 시작일과 마지막일 찾기
        LocalDate firstDayOfMonth = date.withDayOfMonth(1);
        LocalDate lastDayOfMonth  = firstDayOfMonth.withDayOfMonth(firstDayOfMonth.lengthOfMonth());

        // 주차별 시작 날짜 저장
        List<LocalDate> weekStarts = new ArrayList<>();

        // 현재 주의 시작일 (처음에는 1일)
        LocalDate currentStart = firstDayOfMonth;

        while (!currentStart.isAfter(lastDayOfMonth)) {
            // 이 주의 끝(Sunday)을 구한다.
            // currentStart가 월요일~일요일 어느 요일이든,
            // nextOrSame(DayOfWeek.SUNDAY)를 써서 '그 주의 일요일'을 찾는다.
            LocalDate currentEnd = currentStart.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

            // 만약 그 일요일이 달의 마지막 일을 넘어가면, 마지막 일을 주의 끝으로 지정
            if (currentEnd.isAfter(lastDayOfMonth)) {
                currentEnd = lastDayOfMonth;
            }

            // weekStarts에 해당 주의 시작일 저장
            weekStarts.add(currentStart);

            // 다음 주의 시작일 = currentEnd + 1일 (일요일+1 = 월요일)
            LocalDate nextStart = currentEnd.plusDays(1);

            // 만약 nextStart가 달 마지막 일보다 크면 반복 중단
            if (nextStart.isAfter(lastDayOfMonth)) {
                break;
            }

            // 그 외에는 다음 주의 시작일로 갱신
            currentStart = nextStart;
        }

        // 이제 weekStarts에는 이 달의 각 주차별 시작 날짜가 순서대로 들어있음
        // 여기서 date가 속한 주차가 몇 번째인지 찾기
        for (int i = 0; i < weekStarts.size(); i++) {
            LocalDate start = weekStarts.get(i);
            // start를 기준으로 그 주의 일요일
            LocalDate end   = start.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
            if (end.isAfter(lastDayOfMonth)) {
                end = lastDayOfMonth;
            }

            // start ~ end 사이에 date가 있으면 i+1번째 주차
            if (!date.isBefore(start) && !date.isAfter(end)) {
                return i + 1;  // i는 0-based이므로 +1
            }
        }

        // 혹시 못 찾으면 마지막 주차로 반환
        return weekStarts.size();
    }

    // emotionIdx 기준 recommendation 문구
    private String emotionRecommendation(int emotionIdx) {
        return switch (emotionIdx) {
            case 1 -> "즐거운 시간을 보내셨네요! 앞으로도 활기찬 시간을 보내게 될 거예요.";
            case 2 -> "설레는 일이 많으셨군요! 영화같은 순간이 더 생길 거예요.";
            case 3 -> "안도할 일이 생기셨군요. 걱정은 기우일 때가 많답니다.";
            case 4 -> "아무 일도 일어나지 않는 무의 상태도 좋은 상태랍니다.";
            case 5 -> "슬픈 시간을 보내셨네요. 슬픈 마음은 흘려 보내세요.";
            case 6 -> "불안한 시기를 겪고 계시네요. 걱정만큼 불안한 일은 일어나지 않을 거예요.";
            case 7 -> "분노를 겪고 계시군요. 조금만 차분하게 세상을 바라봐볼까요?";
            default -> "행복한 하루 되세요.";
        };
    }
}