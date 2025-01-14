package com.astro.mood.web.advice;

import com.astro.mood.service.exception.CustomException;
import com.astro.mood.web.dto.ApiResponse;
import com.astro.mood.service.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;


@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 존재하지 않는 요청에 대한 예외
    @ExceptionHandler({NoHandlerFoundException.class, HttpRequestMethodNotSupportedException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse<?> handleNoPageFoundException(Exception e) {
        log.error("GlobalExceptionHandler catch NoHandlerFoundException : {}", e.getMessage());
        return ApiResponse.fail(new CustomException(ErrorCode.NOT_FOUND_END_POINT));
    }

    // 런타임 예외 처리
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<?> handleRuntimeException(RuntimeException e) {
        log.error("Runtime error: {}", e.getMessage());
        return ApiResponse.fail(new CustomException(ErrorCode.INTERNAL_SERVER_ERROR));
    }

    // 커스텀 예외 처리
    @ExceptionHandler(CustomException.class)
    public ApiResponse<?> handleCustomException(CustomException e) {
        log.error("handleCustomException() in GlobalExceptionHandler throw CustomException : {}", e.getMessage());
        return ApiResponse.fail(e);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<?>  handleValidationExceptions( MethodArgumentNotValidException e) {
        log.error("handleException() in GlobalExceptionHandler throw Exception : {}", e.getMessage());
        e.printStackTrace();

        return ApiResponse.fail(new CustomException(ErrorCode.MISSING_REQUIRED_PARAMETER));
    }

    // 기본 예외 처리
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<?> handleException(Exception e) {
        log.error("handleException() in GlobalExceptionHandler throw Exception : {}", e.getMessage());
        e.printStackTrace();
        return ApiResponse.fail(new CustomException(ErrorCode.INTERNAL_SERVER_ERROR));
    }
}