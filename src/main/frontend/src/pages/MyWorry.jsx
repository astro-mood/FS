import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {getMyWorry, getWorryComment} from "../api/api";
import WorryList from "../components/board/WorryList";

const MyWorry = () => {
    const [worries, setWorries] = useState([]);

    //페이징추가
    const [loading, setLoading] = useState(false);
    const [nextId, setNextId] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    //커서페이징
    const fetchWorry = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await getMyWorry(nextId);
            if(nextId === null){
                setWorries(response.data.items);
            }else{
                setWorries((prev) => [...prev, ...response.data.items]);
            }
            setNextId(response.data.nextCursor);
            setHasMore(response.data.hasNextPage);
        } catch (error) {
            console.error("고민 데이터를 불러오는 데 실패했습니다.", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        setNextId(null);
        setHasMore(true);
        fetchWorry();
    }, []);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore) {
            fetchWorry();
        }
    };
    return (
        <Container>
            <Board>내가 남긴 고민</Board>
            <ContentsContainer onScroll={handleScroll}>
                <WorryList worries={worries} />
                {loading && <p>불러오는 중...</p>}
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