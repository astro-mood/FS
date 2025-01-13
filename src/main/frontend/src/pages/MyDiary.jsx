import React from "react";
import styled from "styled-components";
import Calendar from "../components/calendar/Calendar";

const MyDiary = () => {

    return (
        <Container>
            <Board>내 일기</Board>
            <Calendar />
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
