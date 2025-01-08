package com.astro.mood.web.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;
@Controller
public class MainController {
    // 루트 경로 요청 처리
    @GetMapping({"/", "/error"})
    public String oauthLogin() {

        return "index.html";// index.html 파일을 반환
    }
}
