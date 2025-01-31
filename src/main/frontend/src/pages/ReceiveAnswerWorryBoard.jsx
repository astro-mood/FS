import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useUser } from '../context/UserContext';
import {getReceiveAnswer, reportWorryComment} from "../api/api";
import { useNavigate } from "react-router";
import Comment from "../components/comment/Comment";

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
                setReceiveAnswerData(response.data.content);
            } catch (error) {
                console.error("받은 답변보기 데이터를 불러오는데 실패했습니다. ", error);
                throw error;
            }
        }
        fetchReceiveAnswerData();
    }, [userIdx]);

    // 댓글 신고
    const handleCommentReport = async (commentIdx) => {
        if (window.confirm("정말 신고하시겠습니까?")) {
            try {
                console.log("신고 요청 데이터:", { commentIdx }); // 요청 데이터 로그
                await reportWorryComment(commentIdx);
                console.log("신고 성공:");
                // fetchWorryComment();
                alert("댓글이 신고되었습니다.");
            } catch (error) {
                console.error("댓글 신고에 실패했습니다.", error);
            }
        }
    };
    const handleClick = (worryIdx) => {
        navigate(`/worry/${worryIdx}`);
    };

    if (!receiveAnswerData) {
        return <LoadingDiv>Loading...</LoadingDiv>;
    }

    return (
        <Container>
            <Board>받은 💌</Board>
            <ContentsContainer>
                <div>
                    {receiveAnswerData.length > 0 ? (
                        receiveAnswerData.map(
                            (answer) => (
                                <AnswerDiv key={answer.commentIdx}>
                                    <StatusContainer>
                                        <CreatedAt>{answer.worryCreatedAt}에 남긴 고민 👾</CreatedAt>
                                        <StatusText>
                                            {answer.isResolved ? "🚀 고민 해결 완료" : "🪐 고민 진행 중"}
                                        </StatusText>
                                    </StatusContainer>
                                    <WorryTitle><a onClick={() => handleClick(answer.worryIdx)}>{answer.worryTitle}</a></WorryTitle>
                                    <Comment
                                        key={answer.commentIdx}
                                        comment={answer}
                                        userId={userIdx}
                                        onReport={handleCommentReport}
                                    />
                                    <WorryLink>
                                        <a onClick={() => handleClick(answer.worryIdx)}>고민다시보기 ⇀</a>
                                    </WorryLink>
                                </AnswerDiv>
                            )
                        )
                    ):(
                        <div>받은 답변이 없습니다.</div>
                    )}
                </div>
            </ContentsContainer>
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
const ContentsContainer = styled.div`
    height: calc(100vh - 180px);
    overflow-y: auto;
    
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    scrollbar-width: none;
`;

const WorryTitle = styled.h3`
    padding: 0 10px;
    & a {
        cursor: pointer;
        &:hover {
            color: #4E2850;
        }
    }
`;
const AnswerDiv = styled.div`
    color:#555;
    background-color: white;
    border-radius: 5px;    
`;

const StatusContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
`;
const CreatedAt = styled.div`
    font-size: 0.9rem;
    color: #303030;
    margin-top: 5px;
`;
const StatusText = styled.div`
    font-size: 0.9rem;
    color: #777;
    margin-top: 5px;
`;
const WorryLink = styled.p`
    text-align: end;
    padding: 10px;
    &>a {
        display: inline-block;
        cursor: pointer;
        color: #4E2850;
        line-height: 24px;
        &:hover {
            color: #111731;
        }
    }
`;