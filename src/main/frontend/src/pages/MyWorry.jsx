import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getMyWorry } from "../api/api";
import WorryList from "../components/board/WorryList";

const MyWorry = () => {
    const [worries, setWorries] = useState([]);

    useEffect(() => {
        const fetchWorry = async () => {
            try {
                const response = await getMyWorry();
                setWorries(response.data);
            } catch (error) {
                console.error("고민 데이터를 불러오는 데 실패했습니다.", error);
            }
        };

        fetchWorry();
    }, []);

    return (
        <Container>
            <Board>내가 남긴 고민</Board>
            <ContentsContainer>
            <WorryList worries={worries} />
        </ContentsContainer>
        </Container>
    );
};

export default MyWorry;

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

const ContentsContainer = styled.div`
    height: calc(100vh - 180px);
    overflow-y: auto;
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    scrollbar-width: none;
`;