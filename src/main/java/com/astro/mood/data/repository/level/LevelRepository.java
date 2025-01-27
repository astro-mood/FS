package com.astro.mood.data.repository.level;

import com.astro.mood.data.entity.level.LevelThresholds;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LevelRepository extends JpaRepository<LevelThresholds,Integer> {
    LevelThresholds findByLevel(Integer level);

}
