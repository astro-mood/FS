import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Calendar from "../components/calendar/Calendar";
import { getMyDiary } from "../api/api";

const MyDiary = () => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

    // 1) 날짜별 정보(감정 + diaryIdx)를 담을 State
    const [diariesMap, setDiariesMap] = useState({});

    // 2) API 요청 함수
    const fetchDiaryData = async () => {
        try {
            const data = { year: currentYear, month: currentMonth };
            const response = await getMyDiary(data);

            // 3) 응답을 받아 날짜별로 diaryIdx, topEmotions를 맵핑
            const tempMap = {};

            // 날짜별로 감정 데이터를 매핑
            response.forEach((entry) => {
                // entry = { date: "2025-01-11", diaryIdx:16, emotions:[...] }

                // 이모지 상위 2개 선택
                const topEmotions = entry.emotions
                    .sort((a, b) => b.userScore - a.userScore)
                    .slice(0, 2)
                    .map((e) => e.emoji);

                // 날짜를 key로, { diaryIdx, emotions: [...]} 형태로 저장
                tempMap[entry.date] = {
                    diaryIdx: entry.diaryIdx,
                    emojis: topEmotions,
                };
            });

            // 4) State에 저장
            setDiariesMap(tempMap);

        } catch (error) {
            console.error("일기 데이터를 가져오는 중 오류 발생:", error);
        }
    };

    // 5) 달력 변경 시마다 데이터 가져오기
    useEffect(() => {
        fetchDiaryData();
    }, [currentYear, currentMonth]);

    return (
        <Container>
            <Board>내 일기</Board>

            {/*
          // 6) <Calendar>에 날짜별 diaryIdx, 이모지 정보를 넘겨준다.
          여기서는 diariesMap( { "2025-01-11": {diaryIdx:16, emojis:[...]} } )
          을 props로 전달
       */}
            <Calendar
                currentYear={currentYear}
                currentMonth={currentMonth}
                setCurrentYear={setCurrentYear}
                setCurrentMonth={setCurrentMonth}
                diariesMap={diariesMap}
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
