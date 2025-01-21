import React, {useState} from "react";
import styled from "styled-components";

const UniverseTemperature = () => {
    const [userRecord, setUserRecord] = useState({
        comfortGiven: 50,
        recentResponse: true,
        temperature: 60,
    });

    return (
        <Container>
            <Title>우주의 온도</Title>
            <ProgressBar>
                <Progress progress={userRecord.temperature} />
            </ProgressBar>
            <Stats>
                <ComfortableGiven>
                <p>위로를 건넨 횟수</p>
                <p> {userRecord.comfortGiven}회</p>
                </ComfortableGiven>
                <WorryContainer>
                <p>내 고민 보기</p>
                <p>받은 💌 보기 {userRecord.recentResponse ? "N" : ""}</p>
            </WorryContainer>
            </Stats>
        </Container>
    );
};

export default UniverseTemperature;

const Container = styled.div`
    background: rgba(72, 49, 101, 0.7);
    padding: 20px;
    border-radius: 10px;
    padding-bottom: 10px;
    text-align: center;
    flex: 1;
    flex-direction: column;
`;

const Title = styled.h2`
    font-size: 1.2rem;
    margin: 0;
    margin-top: -10px;
    margin-bottom: 50px;
    display: flex;
    justify-content: flex-start;
`;

const ProgressBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start; 
    background: #444;
    height: 10px;
    width: 90%;
    border-radius: 5px;
    overflow: hidden;
    margin: -20px auto;
`;

const Progress = styled.div`
    display: flex;
    justify-content: flex-start;
    align-content: center;
    height: 100%;
    width: ${(props) => props.progress}%;
    background: linear-gradient(to right, #05c134, #ff5500);
    transition: width 0.3s ease-in-out;
`;

const ComfortableGiven = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 80%;

`;

const WorryContainer = styled.div`
    display: flex;
    flex-direction:  row;
    align-items: center;
    justify-content: space-between;
    width: 80%;

`;

const Stats = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
    width: 100%;

    & > div {
        margin-bottom: -5px; // 각 항목 간의 간격을 줄이기 위해 음수 margin
    }
`;
