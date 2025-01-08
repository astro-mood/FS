package com.astro.mood.data.entity.emotion;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Emotion {
    JOY(1,"기쁨"),
    EXCITEMENT(2,"설렘"),
    RELIEF(3,"안도"),
    NEUTRAL(4,"보통"),
    SADNESS(5,"슬픔"),
    ANXIETY(6,"불안"),
    ANGER(7,"분노");

    private final int idx;
    private final String description;

    public static Emotion fromDescription(String description) {
        for (Emotion emotion : Emotion.values()) {
            if (emotion.getDescription().equals(description)) {
                return emotion;
            }
        }
        throw new IllegalArgumentException("Invalid emotion description: " + description);
    }
}
