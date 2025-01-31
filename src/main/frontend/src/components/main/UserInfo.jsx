import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useUser} from "../../context/UserContext";
import {useNavigate} from "react-router";

const UserInfo = (props) => {
    const { nickname, profileImage  } = useUser();
    const navigate = useNavigate();

    return (
        <Container>
            <Header>
                <Title>유저정보</Title>
                <EditButton onClick={() => navigate(`/modifyuser`)}>수정하기</EditButton>
            </Header>
            <Content>
                <ProfileImage src={profileImage} />
                <Info>
                    <h2>{nickname}</h2>
                    <p>작성한 일기 수: <a onClick={() => navigate(`/mydiary`)}>{props.diaryCount} 건</a></p>
                </Info>
            </Content>
        </Container>
    );
};

export default UserInfo;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background: rgba(72, 49, 101, 0.7);
    padding: 20px;
    border-radius: 10px;
    width: 50%;
    flex: 1;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const Title = styled.h2`
    font-size: 1.2rem;
    margin: 0;
    margin-top: -30px;
`;

const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 20px;
`;

const ProfileImage = styled.img`
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: #2e4055;
    gap: 2px;
    border: 1px solid white;
`;

const Info = styled.div`
    & a{
        cursor: pointer;
        &:hover{
            color: #7D8DDE;
            border-bottom: 1px solid;
        }
    }
`;

const EditButton = styled.button`
    background: #7D8DDE;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'NeoDunggeunmo';

    &:hover {
        background-color: ${({ color }) => (color === "#7D8DDE" ? "#4E2850" : "#4E2850")};
        transform: scale(1.05);
    }
`;
