package com.astro.mood.service.worry;


import com.astro.mood.data.repository.worry.WorryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorryService {
    private final WorryRepository worryRepository;

}
