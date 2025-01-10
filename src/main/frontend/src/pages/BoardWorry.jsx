import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import WriteButton from "../components/button/WriteButton";


const BoardWorry = () => {
    const navigate = useNavigate();

    //더미데이터
    const worry = [
        {id : 1, title: "첫 번째 고민", content: "이것은 첫 번째 고민의 내용입니다.구글 로그인이 너무 어렵다. 으아아앙 이것은 첫 번째 고민의 내용입니다.구글 로그인이 너무 어렵다. 으아아앙이것은 첫 번째 고민의 내용입니다.구글 로그인이 너무 어렵다. 으아아앙이것은 첫 번째 고민의 내용입니다.구글 로그인이 너무 어렵다. 으아아앙이것은 첫 번째 고민의 내용입니다.구글 로그인이 너무 어렵다. 으아아앙이것은 첫 번째 고민의 내용입니다.구글 로그인이 너무 어렵다. 으아아앙이것은 첫 번째 고민의 내용입니다.구글 로그인이 너무 어렵다. 으아아앙이것은 첫 번째 고민의 내용입니다.구글 로그인이 너무 어렵다. 으아아앙이것은 첫 번째 고민의 내용입니다.구글 로그인이 너무 어렵다. 으아아앙이것은 첫 번째 고민의 내용입니다.구글 로그인이 너무 어렵다. 으아아앙이것은 첫 번째 고민의 내용입니다.구글 로그인이 너무 어렵다. 으아아앙이것은 첫 번째 고민의 내용입니다.구글 로그인이 너무 어렵다. 으아아앙이것은 첫 번째 고민의 내용입니다.구글 로그인이 너무 어렵다. 으아아앙이것은 첫 번째 고민의 내용입니다.구글 로그인이 너무 어렵다. 으아아앙이것은 첫 번째 고민의 내용입니다.구글 로그인이 너무 어렵다. 으아아앙" },
        { id: 2, title: "두 번째 고민", content: "이것은 두 번째 고민의 내용입니다." },
        { id: 3, title: "세 번째 고민", content: "이것은 세 번째 고민의 내용입니다." },
        { id: 4, title: "네 번째 고민", content: "이것은 네 번째 고민의 내용입니다." },
        { id: 5, title: "다섯 번째 고민", content: "이것은 다섯 번째 고민의 내용입니다." },
        { id: 6, title: "여섯 번째 고민", content: "이것은 여섯 번째 고민의 내용입니다." },
        { id: 6, title: "여섯 번째 고민", content: "이것은 여섯 번째 고민의 내용입니다." },
        { id: 6, title: "여섯 번째 고민", content: "이것은 여섯 번째 고민의 내용입니다." },
        { id: 6, title: "여섯 번째 고민", content: "이것은 여섯 번째 고민의 내용입니다." },
        { id: 6, title: "여섯 번째 고민", content: "이것은 여섯 번째 고민의 내용입니다." },
        { id: 6, title: "여섯 번째 고민", content: "이것은 여섯 번째 고민의 내용입니다." },
        { id: 6, title: "여섯 번째 고민", content: "이것은 여섯 번째 고민의 내용입니다." },
        { id: 6, title: "여섯 번째 고민", content: "이것은 여섯 번째 고민의 내용입니다." },
        { id: 6, title: "여섯 번째 고민", content: "이것은 여섯 번째 고민의 내용입니다." },
        { id: 6, title: "여섯 번째 고민", content: "이것은 여섯 번째 고민의 내용입니다." },

    ];

    return (
        <Container>
            <Title>고민상담소</Title>
            <GridContainer>
                {worry.map((worry) => (
                    <Card key={worry.idx}
                          onClick={() => navigate(`/worry/${worry.idx}`)} // 클릭 시 상세 페이지로 이동
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
