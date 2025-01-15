import React from "react";
import styled from "styled-components";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import {useNavigate} from "react-router";
import customJwtDecode from '../../api/jwtDecode';

const GoogleLoginButton = () => {
    const navigate = useNavigate();
    const handleLogin = async (credentialResponse) => {
        const token = credentialResponse.credential;
        //console.log("token:", token);

        if (!token) {
            console.error("Token is null");
            return;
        }

        axios
            .post("http://localhost:8080/api/auth/google",
                { idToken: token },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((response) => {
                let bearer_token = response.headers['bearer_token'];
                localStorage.setItem("token", bearer_token); // 토큰 저장
                let userInfo = customJwtDecode(bearer_token);
                console.log("userInfo : ", userInfo);
                console.log("loginIdx : ", userInfo.loginIdx);
                console.log("nickname : ", userInfo.nickname);
                console.log("profileImage : ", userInfo.profileImage);
                navigate("/main"); // 마이페이지 경로로 이동
            })
            .catch((error) => {
                console.error('Login failed:', error);
            });
    };

    return (
        <GoogleLogin
            onSuccess={(credentialResponse) => handleLogin(credentialResponse)}
            onError={() => console.log('Login failed')}
        />
    );
};

export default GoogleLoginButton;
