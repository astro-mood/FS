package com.astro.mood.service.emotions;


import com.astro.mood.data.repository.emotions.EmotionsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmotionsService {
    private final EmotionsRepository emotionsRepository;

}
