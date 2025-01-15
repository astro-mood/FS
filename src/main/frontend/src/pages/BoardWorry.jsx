import React, {useEffect} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import WriteButton from "../components/button/WriteButton";
import {useState} from "react";
import { getAllWorries } from "../api/api";


const BoardWorry = () => {
    const navigate = useNavigate();
    const [worries, setWorries] = useState([]);

    useEffect(() => {
        const fetchWorries = async () => {
            try {
                const data = await getAllWorries();
                // 최신글이 먼저 나오도록 정렬 변경

                const sortedData = data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setWorries(data);
            } catch (error) {
                console.error("고민 데이터를 불러오는 데 실패했습니다.", error);
            }
        };
        fetchWorries();
    }, []);

    return (
        <Container>
            <Title>고민상담소</Title>
            <GridContainer>
                {worries.map((worry) => (

                    <Card key={worry.worryIdx}
                          onClick={() => navigate(`/worry/${worry.worryIdx}`)}
                    >>
                        <CardTitle>{worry.title}</CardTitle>
                        <CardContent>{worry.content}</CardContent>

                    </Card>
                ))}
            </GridContainer>
            <WriteButton
                text="글 작성하기"
                onClick={() => navigate("/writeworry")}
            />
            </Container>
    );
};

export default BoardWorry;

const Container = styled.div`
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin-top: -20px;
`;

const Title = styled.h1`
    color: white;
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: left;
`;

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    width: 100%;
`;

const Card = styled.div`
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    height: 300px;
    padding: 15px;
    text-align: left;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.05);
    }
`;

const CardTitle = styled.h2`
    font-size: 1.2rem;
    color: #333;
    margin-top: -20px;
    margin-bottom: 0px;
`;

const CardContent = styled.p`
    font-size: 1.0rem;
    color: #555;
    line-height: 1.4;
    overflow: hidden; // 넘치는 내용 숨기기
    text-overflow: ellipsis; // 넘치는 내용 ...표시
    display: -webkit-box;
    -webkit-line-clamp: 11; // 최대 표시줄
    -webkit-box-orient: vertical; 
`;
