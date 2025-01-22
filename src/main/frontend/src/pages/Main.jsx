import React from "react";
import styled from "styled-components";
import UserInfo from "../components/main/UserInfo";
import UniverseTemperature from "../components/main/UniverseTemperature";
import EmotionAnalysis from "../components/main/EmotionAnalysis";
import HappiestDay from "../components/main/HappiestDay";

const Dashboard = () => {

    return (
        <Container>
            <UserContainer>
                <UserInfo />
                <UniverseTemperature />
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