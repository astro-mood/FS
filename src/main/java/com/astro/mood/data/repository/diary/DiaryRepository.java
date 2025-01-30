package com.astro.mood.data.repository.diary;

import com.astro.mood.data.entity.diary.Diary;
import com.astro.mood.data.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Integer> {

    //일기 댓글에서 검증용으로 사용
    Optional<Diary> findById(Integer diaryIdx);

    @Query("SELECT d FROM Diary d WHERE d.user = :user AND YEAR(d.createdAt) = :year AND MONTH(d.createdAt) = :month")
    List<Diary> findByUserAndMonth(@Param("user") User user, @Param("year") Integer year, @Param("month") Integer month);

    // 최신 순으로 일기 가져오기
    @Query("SELECT d FROM Diary d WHERE d.user.userIdx = :userIdx ORDER BY d.createdAt DESC")
    List<Diary> getLatestDiary(@Param("userIdx") Integer userIdx);

    //메인페이지 - 작성한 일기 수
    @Query("select count(d.diaryIdx) from Diary d WHERE d.user.userIdx = :loginIdx")
    int countByUserIdx(@Param("loginIdx") Integer loginIdx);
}
