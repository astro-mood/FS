package com.astro.mood.web.controller;

import com.astro.mood.security.jwt.JWTUtil;
import com.astro.mood.service.auth.AuthService;
import com.astro.mood.service.exception.CustomException;
import com.astro.mood.service.exception.ErrorCode;
import com.astro.mood.web.dto.ApiResponse;
import com.astro.mood.web.dto.auth.SignRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/jwt-login")
public class JwtLoginController {

    private final JWTUtil jwtUtil;
    private final AuthService authService;


    @PostMapping("/signup")
    public ApiResponse<?> signup(
           @Valid @ModelAttribute SignRequest signUpRequest
    ) {

        boolean isSuccess = authService.signUp(signUpRequest);
        return (isSuccess)? ApiResponse.created("created") : ApiResponse.fail(new CustomException(ErrorCode.INVALID_REQUEST_BODY));


    }


}