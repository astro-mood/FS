package com.astro.mood.web.dto.notice;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum NoticeType {
    COMMENT("comment",  "고민에 \uD83D\uDC8C가 도착했어요."),
    REPLY("reply",  "위로에 \uD83D\uDC8C가 도착했어요"),
    LIKE("like",  "당신의 위로가 누군가의 마음에 닿았어요."),
    REPORT("report",  "위로는 청자의 입장으로 생각해주세요."),
    ;


    private final String type;
    private final String message;
}
