package com.astro.mood.service.wordFilter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class ProfanityLoader {
    private final String profanitiesFilePath = "src/main/resources/profanities.json";
    private final String exceptionWordsFilePath = "src/main/resources/exceptionWords.json";


    public List<String> loadProfanities() {
        List<String> profanities = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper(); // JSON을 다루기 위한 ObjectMapper 생성

        try {
            JsonNode rootNode = objectMapper.readTree(new File(profanitiesFilePath));
            JsonNode profanitiesNode = rootNode.get("profanities"); // 비속어 노드 가져오기

            if (profanitiesNode.isArray()) {
                for (JsonNode profanity : profanitiesNode) {
                    profanities.add(profanity.asText());
                }
            }
        } catch (IOException e) {
            log.error("비속어 리스트를 읽는 중 오류 발생", e);
        }
        return profanities;
    }

    public List<String> loadExceptions() {
        List<String> exceptions = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            JsonNode rootNode = objectMapper.readTree(new File(exceptionWordsFilePath));
            JsonNode exceptionsNode = rootNode.get("exceptions");

            if (exceptionsNode.isArray()) {
                for (JsonNode exception : exceptionsNode) {
                    exceptions.add(exception.asText());
                }
            }
        } catch (IOException e) {
            log.error("예외 리스트를 읽는 중 오류 발생", e);
        }
        return exceptions;
    }

}
