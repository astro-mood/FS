import React from "react";
import styled from "styled-components";
import KakaoIconImage from "../../images/kakaotalk_small_logo.png";

const KakaoLogin = () => {
    const originUrl = window.location.origin;

    const rest_api_key = process.env.REACT_APP_KAKAO_REST_APP_KEY;
    const redirect_uri = originUrl +"/api/auth/kakao/callback"; // Redirect URI

    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
    const handleKakaoLogin = () => {
        if (!rest_api_key) {
            console.error("카카오 REST API 키가 설정되지 않았습니다.");
            return;
        }
        window.location.href = kakaoURL;
    };

    return (
        <KakaoButton onClick={handleKakaoLogin}>
            <KakaoIcon src={KakaoIconImage} alt="카카오 아이콘" /> 카카오로 시작하기
        </KakaoButton>
    );
};

export default KakaoLogin;

const KakaoButton = styled.button`
    width: 70%;
    max-width: 300px;
    height: 43px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: #FFDE00;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.05);
    }
`;

const KakaoIcon = styled.img`
    width: 35px;
    height: 35px;
    margin-right: 10px;
`;
