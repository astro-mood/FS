import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import LogoImage from '../../images/logo.png';

const Header = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState("");
    // db에서 가져와야 하는 정보
    const [nickname, setNickname] = useState("닉네임");
    const [profileImage, setProfileImage] = useState("");

    const handleNavClick = (item, path) => {
        setActiveItem(item);
        navigate(path); // 경로 이동
    };

    const handleProfileClick = () => {
        navigate("/main"); // 마이페이지 경로로 이동
    };

    return (
        <HeaderContainer>
            <Logo src={LogoImage} alt="Logo" />
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
            <Logout>로그아웃</Logout>

        </HeaderContainer>
    );
};

export default Header;

const HeaderContainer = styled.div`
    width: 300px;
    height: 100%;
    background: linear-gradient(180deg, #111731 22.5%, #963b74 100%);
    display: flex;
    flex-direction: column;
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
    font-family: Inter;
    font-size: 36px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
`;

const Logo = styled.img`
    width: 227px;
    height: 227px;
    margin-bottom: -60px;
`;

const ProfileContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 20px 0;
    cursor: pointer;
    
`;

const ProfileImage = styled.img`
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    background-color: #D9D9D9;
    border-radius: 50%;
    border: 2px solid white;
    margin-right: 20px; // 이미지와 닉네임 간격
`;

const Nickname = styled.p`
    display: flex;
    width: 136px;
    height: 64px;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
    color: #7D8DDE;
    text-align: center;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
`;

const NavItem = styled.div`
    width: 280px;
    height: 68px;
    flex-shrink: 0;
    color: ${(props) => (props.active ? "#FFFFFF" : "#7D8DDE")};
    text-align: center;
    font-family: Inter, sans-serif;
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
    font-family: Inter;
    font-size: 18px;
    font-weight: 800;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
        color: white;
    }
`;