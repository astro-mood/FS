package com.astro.mood.data.repository.notice;

import com.astro.mood.data.entity.notice.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NoticeRepository extends JpaRepository<Notice,Integer> {

    int countByUserIdxAndTypeAndIsReadFalse(Integer userIdx, String type);

    @Modifying
    @Query("UPDATE Notice n SET n.isRead = true WHERE n.userIdx = :userIdx AND n.isRead = false and n.type = :type")
    void updateIsReadByUserIdxAndType(@Param("userIdx") Integer userIdx, @Param("type") String type);
}
