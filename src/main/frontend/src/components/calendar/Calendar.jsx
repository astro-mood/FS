import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Calendar = ({
                      currentYear ,
                      currentMonth ,
                      setCurrentYear,
                      setCurrentMonth,
                      emotions = {},}) => {
    const navigate = useNavigate();

    const today = new Date();
    const todayDate = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

    const WeekDays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentYear(prev => prev - 1);
            setCurrentMonth(12);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentYear(prev => prev + 1);
            setCurrentMonth(1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    const getStartDayOfMonth = (year, month) => {
        return new Date(year, month - 1, 1).getDay();
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const startDay = getStartDayOfMonth(currentYear, currentMonth);
        const days = [];

        for (let i = 0; i < startDay; i++) {
            days.push(<EmptyDay key={`empty-${i}`} />);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = `${currentYear || new Date().getFullYear()}-${(currentMonth || 1)
                .toString()
                .padStart(2, "0")}-${i.toString().padStart(2, "0")}`;
            const isToday = date === todayDate;
            const dayOfWeek = new Date(currentYear, currentMonth - 1, i).getDay();
            const isSunday = dayOfWeek === 0;
            const isSaturday = dayOfWeek === 6;
            const emotion = emotions[date] || [];

            days.push(
                <Day key={date} isSunday={isSunday} isSaturday={isSaturday} isToday={isToday}>
                    <DayNumber isSunday={isSunday} isSaturday={isSaturday}>
                        {i}
                    </DayNumber>
                    <DayContent>
                        {isToday  && emotion.length === 0 && (
                            <WriteButton onClick={() => navigate(`/writediary?date=${date}`)}>
                                오늘의 일기쓰기
                            </WriteButton>
                        )}
                        {emotion && Array.isArray(emotion) ? (
                            <EmotionDisplay
                                onClick={() => navigate(`/viewdiary?date=${date}`)}
                                title="이날의 일기보기"
                            >
                                {emotion.map((emo, idx) => (
                                    <EmotionSpan key={idx}>{emo}</EmotionSpan>
                                ))}
                            </EmotionDisplay>
                        ) : null}
                    </DayContent>
                </Day>
            );
        }

        return days;
    };

    return (
        <CalendarContainer>
            <MonthHeader>
                <Arrow onClick={handlePrevMonth}>◀</Arrow>
                {currentYear}년 {currentMonth.toString().padStart(2, "0")}월
                <Arrow onClick={handleNextMonth}>▶</Arrow>
            </MonthHeader>

            <WeekdaysContainer>
                {WeekDays.map((day, index) => (
                    <WeekDay key={day} isSunday={index === 0} isSaturday={index === 6}>
                        {day}
                    </WeekDay>
                ))}
            </WeekdaysContainer>

            <DaysContainer>
                {renderCalendar()}
            </DaysContainer>
        </CalendarContainer>
    );
};

export default Calendar;

const CalendarContainer = styled.div`
    height: calc(100vh - 180px);
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    scrollbar-width: none;
`;

const MonthHeader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    margin-bottom: 20px;
    color: black;
`;

const Arrow = styled.span`
    cursor: pointer;
    margin: 0 10px;
    font-size: 1.5rem;
`;

const WeekdaysContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    background-color: #FFFFFF;
    padding: 2px;
    box-sizing: border-box;
    margin-bottom: 10px;
`;

const DaysContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    row-gap: 5px;
    column-gap: 5px;
    grid-auto-rows: calc((100vh - 220px) / 7 - 1px);
    padding: 2px;
    box-sizing: border-box;
`;

const WeekDay = styled.div`
    background-color: #D7C8ED;
    border-color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    height: 30px;
    color: ${(props) =>
            props.isSunday ? "red" : props.isSaturday ? "navy" : "black"};
`;

const EmptyDay = styled.div`
    height: 80px;
`;

const Day = styled.div`
    position: relative;
    background-color: #DDCDD4;
    border-style: dashed;
    border-color: #F9F9F9;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const DayNumber = styled.div`
    position: absolute;
    top: 5px;
    left: 7px;
    font-size: 1rem;
    font-weight: bold;
    color: ${(props) =>
            props.isSunday ? "red" : props.isSaturday ? "navy" : "black"};
    padding-bottom: 2px;
`;

const DayContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
`;

const WriteButton = styled.button`
    background-color: #7d8dde;
    height: 35px;
    width: 90px;
    font-weight: bold;
    cursor: pointer;
    color: white;
    border: none;
    border-radius: 50px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.2s, transform 0.2s;
    font-family: 'NeoDunggeunmo';

    &:hover {
        background-color: #4E2850;
        transform: scale(1.05);
    }
`;

const EmotionDisplay = styled.div`
    font-size: 2rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const EmotionSpan = styled.span`
    margin-left: -0.5em;
    &:first-child {
        margin-left: 0;
    }
`;
