package com.astro.mood.service.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // Test Error
    TEST_ERROR(10000, HttpStatus.BAD_REQUEST, "테스트 에러입니다."),

    // 400 Bad Request
    INVALID_PARAMETER(40000, HttpStatus.BAD_REQUEST, "잘못된 요청 파라미터입니다."),
    MISSING_REQUIRED_PARAMETER(40001, HttpStatus.BAD_REQUEST, "필수 파라미터가 누락되었습니다."),
    INVALID_REQUEST_BODY(40002, HttpStatus.BAD_REQUEST, "잘못된 요청 본문입니다."),
    //  400 Bad Request - 사용자정보 수정
    INVALID_VALUE_EMAIL(40003, HttpStatus.BAD_REQUEST, "잘못된 이메일 형식입니다."),
    INVALID_VALUE_NICKNAME(40004, HttpStatus.BAD_REQUEST, "20자 이내의 닉네임을 설정해주세요."),
    INVALID_VALUE_PHONE(40005, HttpStatus.BAD_REQUEST, "전화번호는 11자로 설정되어야 합니다."),
    //S3 ERROR - 400
    S3_INVALID_VALUE_URL(40006, HttpStatus.BAD_REQUEST, "잘못된 URL 형식입니다"),
    S3_FILE_EXTENSION_NOT_FOUND(40007, HttpStatus.BAD_REQUEST, "확장자를 찾을 수 없습니다."),
    S3_UNSUPPORTED_FILE_TYPE(40008, HttpStatus.BAD_REQUEST, "[jpg, jpeg, png, gif]의 확장자만 사용 가능합니다."),
    LIKE_COMMENT_IS_REPORTED(40009, HttpStatus.BAD_REQUEST, "신고된 댓글에 좋아요 할 수 없습니다."),


    // 401 Unauthorized
    UNAUTHORIZED(40100, HttpStatus.UNAUTHORIZED, "인증되지 않은 사용자입니다."),

    // 403 Forbidden
    FORBIDDEN(40300, HttpStatus.FORBIDDEN, "권한이 없습니다."),
    WITHDRAW_FORBIDDEN(40301, HttpStatus.FORBIDDEN, "이미 탈퇴한 회원입니다."),

    // 404 Not Found
    NOT_FOUND_END_POINT(40400, HttpStatus.NOT_FOUND, "존재하지 않는 API입니다."),
    RESOURCE_NOT_FOUND(40401, HttpStatus.NOT_FOUND, "요청한 리소스를 찾을 수 없습니다."),
    USER_NOT_FOUND(40402, HttpStatus.NOT_FOUND, "사용자 정보를 찾을 수 없습니다."),
    //S3 ERROR - 404
    S3_IMAGE_NOT_FOUND(40403, HttpStatus.NOT_FOUND, "이미지가 비어있거나 파일 이름이 없습니다."),

    // 500 Internal Server Error
    INTERNAL_SERVER_ERROR(50000, HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류입니다."),
    UNEXPECTED_ERROR(50001, HttpStatus.INTERNAL_SERVER_ERROR, "예상치 못한 오류가 발생했습니다."),
    //S3 ERROR - 500
    S3_UPLOAD_ERROR(50002, HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드에 실패했습니다."),
    S3_UPLOAD_IO_ERROR(50003, HttpStatus.BAD_REQUEST, "이미지 업로드 중 IO 예외가 발생했습니다."),
    S3_DELETE_ERROR(50004, HttpStatus.INTERNAL_SERVER_ERROR, "이미지 삭제에 실패했습니다."),
    S3_DELETE_UNEXPECTED_ERROR(50005, HttpStatus.INTERNAL_SERVER_ERROR, "이미지 삭제 중 알 수 없는 오류가 발생했습니다."),
    S3_URL_DECODING_ERROR(50006, HttpStatus.INTERNAL_SERVER_ERROR, "URL 디코딩에 실패했습니다.")

;
    private final Integer code;
    private final HttpStatus httpStatus;
    private final String message;
}