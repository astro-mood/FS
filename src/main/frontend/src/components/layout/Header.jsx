import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import LogoImage from '../../images/logo.png';
import {useUser} from "../../context/UserContext";
import axios from "axios";

const Header = () => {
    const { nickname, profileImage  } = useUser();
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState("");

    const handleNavClick = (item, path) => {
        setActiveItem(item);
        navigate(path); // 경로 이동
    };

    const handleProfileClick = () => {
        navigate("/main"); // 마이페이지 경로로 이동
    };

    const kakaoLogout = async () => {
        try {
            const rest_api_key = process.env.REACT_APP_KAKAO_REST_APP_KEY;
            const redirect_uri = window.location.origin; // Redirect URI

            const datas = await axios.get(
                `https://kauth.kakao.com/oauth/logout?client_id=${rest_api_key}&logout_redirect_uri=${redirect_uri}`
            );
            console.log("카카오 로그아웃 성공:", datas.data);
        } catch (error) {
            console.error("카카오 로그아웃 실패:", error);
        }
    };
    const handleLogoutClick = () => {
        try{
            const isKakao = localStorage.getItem("isKakao");
            if (isKakao !== null) {
                kakaoLogout();
            }
        }catch (e) {
            console.error(e);
        }finally {
            window.localStorage.clear();
            window.location.href = `/`;
        }
    };


    return (
        <HeaderContainer>
            <Logo src={LogoImage} alt="Logo"  onClick={handleProfileClick} />
            <HeaderTitle>ASTRO MOOD</HeaderTitle>
            <ProfileContainer onClick={handleProfileClick}>
                <ProfileImage src={profileImage} alt="" />
                <Nickname>{nickname}</Nickname>
            </ProfileContainer>
            <div>
                <NavItem
                    active={activeItem === "고민상담소"}
                    onClick={() => handleNavClick("고민상담소", "/boardworry")}
                >
                    고민상담소
                </NavItem>
                <NavItem
                    active={activeItem === "내 일기 보기"}
                    onClick={() => handleNavClick("내 일기 보기", "/mydiary")}
                >
                    내 일기 보기
                </NavItem>
                <NavItem
                    active={activeItem === "이용방법"}
                    onClick={() => handleNavClick("이용방법", "/aboutlogin")}
                >
                    이용방법
                </NavItem>
            </div>
            <Logout onClick={() => handleLogoutClick("로그아웃", "/")}>로그아웃</Logout>

        </HeaderContainer>
    );
};

export default Header;

const HeaderContainer = styled.div`
    width: 250px;
    height: 100%;
    background: linear-gradient(180deg, #111731 22.5%, #963b74 100%);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    color: white;
    position: relative; // 로그아웃 위치 옮기기 위해 설정
`;

const HeaderTitle  = styled.h1`
    width: 254px;
    height: 57px;
    flex-shrink: 0;
    color: #DDCDD4;
    text-align: center;
    font-size: 36px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
`;

const Logo = styled.img`
    width: 227px;
    height: 227px;
    margin-bottom: -60px;
    cursor: pointer;
`;

const ProfileContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
    cursor: pointer;
    gap : 25px;
    width: 100%;
`;

const ProfileImage = styled.img`
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    background: #2e4055;
    border-radius: 50%;
    border: 1px solid white;
`;

const Nickname = styled.p`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
    color: #7D8DDE;
    font-size: 20px;
    font-weight: bold;
`;

const NavItem = styled.div`
    width: 280px;
    height: 68px;
    flex-shrink: 0;
    color: ${(props) => (props.active ? "#FFFFFF" : "#7D8DDE")};
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 68px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
        color: #FFFFFF;
    }
`;

const Logout = styled.div`
    position: absolute; // 로그아웃 위치 오른쪽으로 옮기기 위해 설정
    bottom: 20px;
    right: 20px;
    color: #7D8DDE;
    font-size: 18px;
    font-weight: 800;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
        color: white;
    }
`;