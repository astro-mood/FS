import React from "react";
import styled from "styled-components";
import GoogleIconImage from "../../images/google_logo.png";

const GoogleLogin = ({ onClick }) => {
    return (
        <GoogleButton onClick={onClick}>
            <GoogleIcon src={GoogleIconImage} alt="구글 아이콘" /> Sign up with Google
        </GoogleButton>
    );
};

export default GoogleLogin;

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
    width: 40px;
    height: 40px;
    margin-right: 10px;
`;
