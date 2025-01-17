import React, {useEffect, useState} from "react";
import styled from "styled-components";
import Calendar from "../components/calendar/Calendar";
import {getMyDiary} from "../api/api";

const MyDiary = () => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [emotions, setEmotions] = useState({});

    const fetchDiaryData = async () => {
        try {
            const data = {
                year: currentYear,
                month: currentMonth,
            };
            const response = await getMyDiary(data);
            console.log("API Response:", response);

            const emotionsMap = {};

            // 날짜별로 감정 데이터를 매핑
            response.forEach(entry => {
                // 이모지 상위 2개 선택
                const topEmotions = entry.emotions
                    .sort((a, b) => b.userScore - a.userScore) // userScore 기준 내림차순 정렬
                    .slice(0, 2)
                    .map(e => e.emoji);
                emotionsMap[entry.date] = topEmotions;
            });
            setEmotions(emotionsMap);
        } catch (error) {
            console.error("일기 데이터를 가져오는 중 오류 발생:", error);
        }
    };

    // 달력 변경 시 데이터 가져오기
    useEffect(() => {
        fetchDiaryData();
    }, [currentYear, currentMonth]);

    return (
        <Container>
            <Board>내 일기</Board>
            <Calendar
                currentYear={currentYear}
                currentMonth={currentMonth}
                setCurrentYear={setCurrentYear}
                setCurrentMonth={setCurrentMonth}
                emotions={emotions}
            />
        </Container>
    );
};

export default MyDiary;

const Container = styled.div`
    flex-direction: column;
    padding: 20px;
    margin-top: -20px;
`;

const Board = styled.h1`
    color: white;
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: left;
`;
