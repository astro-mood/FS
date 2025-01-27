package com.astro.mood.data.repository.notice;

import com.astro.mood.data.entity.notice.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice,Integer> {

    int countByUserIdxAndTypeAndIsReadFalse(Integer userIdx, String type);
}
