import React from "react";
import styled from "styled-components";
import KakaoIconImage from "../../images/kakaotalk_small_logo.png";

const KakaoLogin = ({ onClick }) => {
    return (
        <KakaoButton onClick={onClick}>
            <KakaoIcon src={KakaoIconImage} alt="카카오 아이콘" /> 카카오로 시작하기
        </KakaoButton>
    );
};

export default KakaoLogin;

const KakaoButton = styled.button`
    height: 45px;
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
