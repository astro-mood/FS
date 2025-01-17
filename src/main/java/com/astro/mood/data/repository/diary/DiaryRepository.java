package com.astro.mood.data.repository.diary;

import com.astro.mood.data.entity.diary.Diary;
import com.astro.mood.data.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Integer> {
    @Query("SELECT d FROM Diary d WHERE d.user = :user AND YEAR(d.createdAt) = :year AND MONTH(d.createdAt) = :month")
    List<Diary> findByUserAndMonth(@Param("user") User user, @Param("year") Integer year, @Param("month") Integer month);
}
