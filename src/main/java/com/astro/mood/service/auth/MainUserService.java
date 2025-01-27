package com.astro.mood.service.auth;


import com.astro.mood.data.entity.level.LevelThresholds;
import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.repository.level.LevelRepository;
import com.astro.mood.data.repository.notice.NoticeRepository;
import com.astro.mood.service.diary.DiaryService;
import com.astro.mood.web.dto.auth.MainUserInfoResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MainUserService {
    private final AuthService authService;
    private final DiaryService diaryService;
    private final LevelRepository levelRepository;
    private final NoticeRepository noticeRepository;

    //유저정보 가져오기
    public MainUserInfoResponse getUserInfo(Integer loginIdx) {
        User user = authService.findUserByIdOrThrow(loginIdx);
        LevelThresholds level = levelRepository.findByLevel(user.getLevel()); //레벨
        int diaryCount = diaryService.getCountDiaryByUserIdx(loginIdx); //작성한 일기 수
        int answerCount = noticeRepository.countByUserIdxAndTypeAndIsReadFalse(loginIdx, "comment");//받은 답변 카운트 수

        return MainUserInfoResponse.from(user, level, diaryCount, answerCount);
    }

}
