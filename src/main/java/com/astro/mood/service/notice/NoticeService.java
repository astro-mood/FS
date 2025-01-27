package com.astro.mood.service.notice;


import com.astro.mood.data.entity.notice.Notice;
import com.astro.mood.data.repository.notice.NoticeRepository;
import com.astro.mood.service.exception.CustomException;
import com.astro.mood.service.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Slf4j
public class NoticeService {
    private final NoticeRepository noticeRepository;

    // 알림생성
    public void addNotice(Integer targetIdx, Integer targetUserIdx, String type) {
        try {
            Notice notice = Notice.builder()
                    .type(type)
                    .userIdx(targetUserIdx)
                    .build();

            if(type.equals("comment")){
                notice.setWorryIdx(targetIdx);
            }else if(type.equals("reply") || type.equals("like") || type.equals("report")){
                notice.setWcIdx(targetIdx);
            }else{
                throw new CustomException(ErrorCode.NOTICE_TYPE_ERROR);
            }
            noticeRepository.save(notice);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.ADD_NOTICE_ERROR);
        }
    }
    
    
    // 알림해제
    @Transactional(transactionManager = "tmJpa")
    public void readNotice(Integer noticeIdx) {
        //TODO 리스트로 들어오지 않을까?
        Notice notice = noticeRepository.findById(noticeIdx).orElseThrow( () -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
        notice.setIsRead(true);

    }



}
