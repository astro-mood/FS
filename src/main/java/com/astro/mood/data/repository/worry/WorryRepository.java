package com.astro.mood.data.repository.worry;

import com.astro.mood.data.entity.user.User;
import com.astro.mood.data.entity.worry.Worry;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WorryRepository extends JpaRepository<Worry,Integer> {

    // 최신 순으로 고민글 가져오기
    @Query("SELECT w FROM Worry w WHERE w.user.userIdx = :userIdx ORDER BY w.createdAt DESC")
    List<Worry> getWorryByUserIdx(@Param("userIdx") Integer userIdx);

    // 최신 순으로 나의 고민글 가져오기_페이징
    List<Worry> findByUserOrderByWorryIdxDesc(User user, Pageable pageable);
    List<Worry> findByUserAndWorryIdxLessThanOrderByWorryIdxDesc(User user, Integer lastId, Pageable pageable);

    // 최신 순으로 고민글 가져오기_페이징
    List<Worry> findAllByOrderByWorryIdxDesc(Pageable pageable);
    List<Worry> findByWorryIdxLessThanOrderByWorryIdxDesc(Integer lastId, Pageable pageable);
}
