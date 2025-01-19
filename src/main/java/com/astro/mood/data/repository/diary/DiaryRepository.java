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

}
