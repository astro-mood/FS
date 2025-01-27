import React, {useEffect, useState} from "react";
import styled from "styled-components";
import UserInfo from "../components/main/UserInfo";
import UniverseTemperature from "../components/main/UniverseTemperature";
import EmotionAnalysis from "../components/main/EmotionAnalysis";
import HappiestDay from "../components/main/HappiestDay";
import {getMainUserInfo} from "../api/api";
import {useUser} from "../context/UserContext";

const Dashboard = () => {
    const { userIdx } = useUser();

    const [diaryCount, setDiaryCount] = useState(0);
    const [userInfo, setUserInfo] = useState();

    useEffect(() => {
        // userIdx가 undefined인 경우 처리
        if (!userIdx) {
            console.log("사용자 정보가 없습니다.");
            return; // 더 이상 진행하지 않음
        }
        const fetchUserData = async () => {
            try {
                const response = await getMainUserInfo(userIdx);
                const userInfo = response.data;
                setUserInfo(userInfo);
                setDiaryCount(userInfo.diaryCount);
            } catch (error) {
                console.error("API 요청 에러:", error);
                throw error;
            }
        }
        fetchUserData();
    }, [userIdx]);

    return (
        <Container>
            <UserContainer>
                <UserInfo diaryCount={diaryCount} />
                <UniverseTemperature userInfo={userInfo} />
            </UserContainer>
            <EmotionContainer>
                <EmotionAnalysis />
                <HappiestDay />
            </EmotionContainer>
        </Container>
    );
};

export default Dashboard;

const Container = styled.div`
    width: calc(100% - 60px); 
    max-width: 2000px; 
    height: calc(100vh - 10px);
    flex-shrink: 0;
    background-size: cover;
    padding: 20px;
    color: white;
    gap: 20px;
    display: flex;
    margin-bottom: 0;
    flex-direction: column; 
    box-sizing: border-box;
`;

const UserContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 20px;
    align-items: stretch; // 높이 맞춤
    margin-bottom: 0px;
    flex: 0; 
`;

const EmotionContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 20px;
    width: 100%; 
    box-sizing: border-box;
    flex: 1; 
    height: 90%;
    overflow: auto;
    align-items: stretch;

`;