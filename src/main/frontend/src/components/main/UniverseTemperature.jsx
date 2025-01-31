import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {useNavigate} from "react-router";

const images = require.context('../../images/levels', false, /\.png$/);

const getImageForLevel = (level) => {
    const levelStr = String(level).padStart(2, "0");
    try {
        const image = images(`./level_${levelStr}.png`);
        return image.default || image; // default 속성 없을 경우 직접 반환
    } catch (error) {
        console.error(`레벨 이미지 오류 ${levelStr}`, error);
        return null; // 이미지가 없을 경우 null 반환
    }
};

const UniverseTemperature = (props) => {
    const navigate = useNavigate();

    const [userRecord, setUserRecord] = useState({
        commentCount: 0,
        answerCount: 0,
        temperature: 0,
        level: 0,
        thresholds: 0,
    });

    const [levelImgs, setLevelImgs] = useState({
        currentLevelImg: "",
        nextLevelImg: "",
    });
    useEffect(() => {
        if (props.userInfo) {
            const { commentCount, answerCount, level, exp } = props.userInfo;
            const currentLevel = level.level;
            const nextLevel = (level.level === 10) ? null : level.level + 1;

            setUserRecord({
                commentCount,
                answerCount,
                temperature : exp,
                level: level.level,
                thresholds: level.threshold,
            });

            setLevelImgs({
                currentLevelImg: getImageForLevel(currentLevel),
                nextLevelImg: nextLevel ? getImageForLevel(nextLevel) : null,
            });
        }
    }, [props.userInfo]); // userInfo가 변경될 때마다 실행

    if (!props.userInfo) {
        return <Container><LoadingDiv>Loading...</LoadingDiv></Container>;
    }
    return (
        <Container>
            <Title>우주의 온도</Title>
            <LevelSection>
                {levelImgs.currentLevelImg &&  (
                    <CurrentLevel src={levelImgs.currentLevelImg} />
                )}
                <ProgressBar>
                    <Progress progress={userRecord.temperature}/>
                </ProgressBar>
                {levelImgs.nextLevelImg && (
                    <NextLevel src={levelImgs.nextLevelImg} />
                )}
            </LevelSection>


            <Stats>
                <StatsInnerDiv>
                    <p>위로를 건넨 횟수</p>
                    <p>
                        <button onClick={ () => navigate(`/answerworryboard`) } >{userRecord.commentCount}회</button>
                    </p>
                </StatsInnerDiv>
                <StatsInnerDiv>
                    <p>
                        {/*<a onClick={() => navigate(`/myworry`)}>내 고민 보기</a>*/}
                        <button onClick={() => navigate(`/myworry`)}>내 고민 보기</button>
                    </p>
                    <p>
                        <button onClick={() => navigate(`/receiveanswerboard`)}>
                            받은 💌 보기
                            {userRecord.answerCount > 0 && (
                                <AnswerCount>
                                    {userRecord.answerCount > 99 ? "N" : userRecord.answerCount}
                                </AnswerCount>
                            )}
                        </button>
                    </p>
                </StatsInnerDiv>
            </Stats>
        </Container>
    );
};

export default UniverseTemperature;

const Container = styled.div`
    background: rgba(72, 49, 101, 0.7);
    padding: 20px 20px 10px;
    border-radius: 10px;
    text-align: center;
    flex: 1;
    flex-direction: column;
`;
const LoadingDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 120px;
    flex: 1;
`;
const Title = styled.h2`
    font-size: 1.2rem;
    margin: -10px 0 20px;
    display: flex;
    justify-content: flex-start;
`;

const LevelSection = styled.section`
    position: relative;
    height: 32px;
    width: 100%;
`;
const CurrentLevel = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    width: 32px;
    height: 32px;
    background-image: url(${(props) => props.src});
    background-size: cover;
`;

const NextLevel = styled.img`
    position: absolute;
    right: 0;
    top: 0;
    z-index: 3;
    width: 32px;
    height: 32px;
    background-image: url(${(props) => props.src});
    background-size: cover;
`;

const ProgressBar = styled.div`
    background: #444;
    height: 10px;
    width: 95%;
    border-radius: 5px;
    overflow: hidden;
    position: absolute;
    top: 11px;
    left: 2.5%;
`;

const Progress = styled.div`
    height: 100%;
    border-radius: 5px;
    width: ${(props) => props.progress}%;
    background: linear-gradient(to right, #05c134, #ff5500);
    transition: width 0.3s ease-in-out;
`;


const StatsInnerDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    & > p {
        flex: 1;
        margin: 0;
        line-height: 24px;
        padding: 5px 10px;
    }
    & button {
        align-self: end;
        background: none;
        border: none;
        cursor: pointer;
        font-size: inherit;
        font-weight: inherit;
        font-family: inherit;
        color: inherit;
        border-bottom: 1px solid transparent;
        transition: border-color 0.3s;
        &:hover {
            color: #7D8DDE;
            border-bottom: 1px solid #7D8DDE;
        }
    }
`;

const AnswerCount = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: #963B74;
    color: white;
    border-radius: 50%;
    overflow: hidden;
    margin-left: 5px;
`;

const Stats = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    width: 100%;
`;
