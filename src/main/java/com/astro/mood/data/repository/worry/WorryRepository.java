package com.astro.mood.data.repository.worry;

import com.astro.mood.data.entity.worry.Worry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorryRepository extends JpaRepository<Worry,Integer> {
}
