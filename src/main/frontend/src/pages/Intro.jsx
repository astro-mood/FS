import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LogoImage from "../images/logo.png";
import KakaoLogin from "../components/intro/KakaoLogin";
import GoogleLogin from "../components/intro/GoogleLogin";

const Intro = () => {
    const navigate = useNavigate();

    const handleGuideClick = () => {
        navigate("/aboutall");
    };

    const handleKakaoLogin = () => {
        navigate("/kakao-login");
    };

    const handleGoogleLogin = () => {
        navigate("http://localhost:8080/login/oauth2/code/google");
    };

    return (
        <IntroContainer>
            <Logo src={LogoImage} alt="ASTRO MOOD 로고" />
            <Text>ASTRO MOOD와 함께<br />감정을 정리하고 내일을 준비해보세요.</Text>
            <LoginContainer>
                <KakaoLogin onClick={handleKakaoLogin} />
                <GoogleLogin onClick={handleGoogleLogin} />
            </LoginContainer>
            <GuideButton onClick={handleGuideClick}>이용방법 알아보기</GuideButton>
        </IntroContainer>
    );
};

export default Intro;

const IntroContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
`;

const Logo = styled.img`
    width: 400px;
    height: 400px;
    margin-top: -80px;
`;

const Text = styled.h1`
    color: #FFF;
    text-align: center;
    font-size: 30px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    white-space: pre-wrap; // 줄바꿈
    margin-top: -50px;
`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 300px;
    margin-top: 50px;
`;

const GuideButton = styled.button`
    padding: 10px;
    background-color: #7D8DDE;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.2s;
    width: 100%;
    max-width: 300px;
    margin-top: 50px;
    text-align: center;
    font-weight: bold;
    font-family: "NeoDunggeunmo";

    &:hover {
        transform: scale(1.05);
    }
`;