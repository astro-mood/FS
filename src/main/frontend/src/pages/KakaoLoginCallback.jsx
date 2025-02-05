import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {useNavigate} from "react-router";
import { useUser } from "../context/UserContext";

import axios from "axios";
import customJwtDecode from "../api/jwtDecode";

const KakaoLoginCallback = () => {
    const { setUserIdx,setNickname,setProfileImage } = useUser();
    const navigate = useNavigate();
    const PARAMS = new URL(document.location).searchParams;
    const KAKAO_CODE = PARAMS.get("code");
    const [accessTokenFetching, setAccessTokenFetching] = useState(false);
    console.log("KAKAO_CODE:", KAKAO_CODE);
    const originUrl = window.location.origin;


    // Access Token 받아오기
    const getLoginInfo = async () => {
        try {
            const originUrl = window.location.origin;
            const response = await axios.post(
                originUrl+"/api/auth/kakao",
                { idToken: KAKAO_CODE },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const bearer_token = response.headers['bearer_token'];
            localStorage.setItem("token", bearer_token); // 토큰 저장
            localStorage.setItem("isKakao",true);
            // 사용자 정보 추출
            const userInfo = customJwtDecode(bearer_token);

            console.log("userInfo:", userInfo);
            console.log("loginIdx:", userInfo.loginIdx);
            console.log("nickname : ", userInfo.nickname);
            console.log("profileImage : ", userInfo.profileImage);
            navigate("/main"); // 마이페이지 경로로 이동

            // 전역 상태로 userIdx 업데이트
            setUserIdx(userInfo.loginIdx);
            setNickname(userInfo.nickname);
            setProfileImage(userInfo.profileImage);

        } catch (error) {
            console.error('Login failed:', error);
            navigate("/");
        }
    };

    useEffect(() => {
        if (KAKAO_CODE) {
            getLoginInfo();
        }
    }, [KAKAO_CODE]);























    return (
       <>로그인중</>
    );
};

export default KakaoLoginCallback;

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
