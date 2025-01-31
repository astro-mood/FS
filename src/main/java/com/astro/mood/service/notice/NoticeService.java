package com.astro.mood.service.notice;


import com.astro.mood.data.entity.notice.Notice;
import com.astro.mood.data.entity.worry.WorryComment;
import com.astro.mood.data.repository.notice.NoticeRepository;
import com.astro.mood.service.exception.CustomException;
import com.astro.mood.service.exception.ErrorCode;
import com.astro.mood.web.dto.notice.NoticeType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
@Slf4j
public class NoticeService {
    private final NoticeRepository noticeRepository;

    // 알림생성
    public void addNotice(WorryComment comment, Integer targetUserIdx, String type) {
        try {
            Notice notice = Notice.builder()
                    .type(type)
                    .userIdx(targetUserIdx)
                    .wcIdx(comment.getCommentIdx())
                    .build();

            // Enum에 정의된 타입만 체크
            boolean isValidType = Arrays.stream(NoticeType.values())
                    .anyMatch(noticeType -> noticeType.getType().equals(type));

            if (!isValidType) {
                throw new CustomException(ErrorCode.NOTICE_TYPE_ERROR);
            }

            if(type.equals("comment") ){
                notice.setWorryIdx(comment.getWorry().getWorryIdx());
            }
            noticeRepository.save(notice);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.ADD_NOTICE_ERROR);
        }
    }

    //단일 알림해제
    @Transactional(transactionManager = "tmJpa")
    public void readNotice(Integer noticeIdx) {
        Notice notice = noticeRepository.findById(noticeIdx).orElseThrow( () -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
        notice.setIsRead(true);
    }

    // 전체 알림해제
    @Transactional(transactionManager = "tmJpa")
    public void readNotices(Integer userIdx, String type) {
        //userIdx가 같은 notice 전부를 isRead를 true로 바꾸기
        noticeRepository.updateIsReadByUserIdxAndType(userIdx,type);
    }

    // 고민 답변 알림해제
    @Transactional(transactionManager = "tmJpa")
    public void readNoticesByWorryIdx(String type, Integer worryIdx) {
        noticeRepository.updateIsReadByUserIdxAndTypeAndWorryIdx(type, worryIdx);
    }

}
