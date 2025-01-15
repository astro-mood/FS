import React from "react";
import styled from "styled-components";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import {useNavigate} from "react-router";
import customJwtDecode from '../../api/jwtDecode';
import { useUser } from "../../context/UserContext";


const GoogleLoginButton = () => {
    const { setUserIdx } = useUser();
    const { setNickname } = useUser();
    const { setProfileImage } = useUser();

    const navigate = useNavigate();

    const handleLogin = async (credentialResponse) => {
        const token = credentialResponse.credential;

        if (!token) {
            console.error("Token is null");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/google",
                { idToken: token },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const bearer_token = response.headers['bearer_token'];
            localStorage.setItem("token", bearer_token); // 토큰 저장

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
        }
    };

    return (
        <GoogleLogin
            onSuccess={(credentialResponse) => handleLogin(credentialResponse)}
            onError={() => console.log('Login failed')}
        />
    );
};

export default GoogleLoginButton;
