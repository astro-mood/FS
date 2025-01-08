import React from "react";
import styled from "styled-components";
import GoogleIconImage from "../../images/google_logo.png";

const GoogleLoginButton = () => {
    const CLIENT_ID = process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID;
    const REDIRECT_URI = "http://localhost:8080/login/oauth2/code/google";
    const SCOPE = "email profile";

    // Google OAuth URL 생성
    const handleRedirectLogin = () => {
        const googleOAuthURL = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&access_type=offline`;
        window.location.href = googleOAuthURL;
    };


    return (
            <GoogleButton onClick={handleRedirectLogin}>
                <GoogleIcon src={GoogleIconImage} alt="구글 아이콘" />
                Sign up with Google
            </GoogleButton>
    );
};

export default GoogleLoginButton;



const GoogleButton = styled.button`
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: #F2F2F2;
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

const GoogleIcon = styled.img`
    width: 35px;
    height: 35px;
    margin-right: 10px;
`;
