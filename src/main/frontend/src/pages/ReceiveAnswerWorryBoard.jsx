import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useUser } from '../context/UserContext';
import {getReceiveAnswer} from "../api/api";
import { useNavigate } from "react-router";

const ReceiveAnswerWorryBoard = () => {
    const hello = "내가 받은 답변보기 (리스트)";
    const navigate = useNavigate();
    const { userIdx } = useUser();
    const [receiveAnswerData, setReceiveAnswerData] = useState({});

    useEffect(() => {
        // userIdx가 undefined인 경우 처리
        if (!userIdx) {
            console.log("사용자 정보가 없습니다.");
            return; // 더 이상 진행하지 않음
        }
        const fetchReceiveAnswerData = async () => {
            try {
                const response = await getReceiveAnswer(userIdx);
                console.log(response);
            } catch (error) {
                console.error("API 요청 에러:", error);
                throw error;
            }
        }
        fetchReceiveAnswerData();
    }, [userIdx]);

    if (!receiveAnswerData) {
        return <LoadingDiv>Loading...</LoadingDiv>;
    }

    return (
        <Container>
            <Board>받은 💌</Board>
        </Container>
    );
};

export default ReceiveAnswerWorryBoard;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1.25rem;
    margin-top: -1.25rem;
    min-height: 97%;
`;

const Board = styled.h1`
    color: white;
    font-size: 1.8rem;
    margin-bottom: 1.25rem;
    text-align: left;
`;
const LoadingDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    flex: 1;
`;


