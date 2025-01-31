import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUser } from '../context/UserContext';
import {
    getSendAnswer,
    updateWorryComment,
    deleteWorryComment
} from "../api/api";
import { useNavigate } from "react-router";
import Comment from "../components/comment/Comment";


const AnswerWorryBoard = () => {
    const navigate = useNavigate();
    const { userIdx } = useUser();
    const [sendAnswerData, setSendAnswerData] = useState({});
    const [editedComment, setEditedComment] = useState({ id: null, content: "" });
    const fetchAnswerData = async () => {
        try {
            const response = await getSendAnswer(userIdx);
            setSendAnswerData(response.data.content);
        } catch (error) {
            console.error("답변한 고민 데이터를 불러오는데 실패했습니다. ", error);
            throw error;
        }
    }
    useEffect(() => {
        // userIdx가 undefined인 경우 처리
        if (!userIdx) {
            console.log("사용자 정보가 없습니다.");
            return; // 더 이상 진행하지 않음
        }
        fetchAnswerData();
    }, [fetchAnswerData, userIdx]);

    // 댓글 수정
    const handleCommentEdit = async (commentIdx, newContent) => {
        try {
            await updateWorryComment(commentIdx, { content: newContent });
            fetchAnswerData();
            setEditedComment({ id: null, content: "" });
            alert("댓글이 수정되었습니다.");
        } catch (error) {
            console.error("댓글 수정에 실패했습니다.", error);
        }
    };

    // 댓글 삭제
    const handleCommentDelete = async (commentIdx) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                await deleteWorryComment(commentIdx);
                fetchAnswerData();
                alert("댓글이 삭제되었습니다.");
            } catch (error) {
                console.error("댓글 삭제에 실패했습니다.", error);
            }
        }
    };

    const handleClick = async (worryIdx) => {
        navigate(`/worry/${worryIdx}`); //고민 페이지 이동
    };

    if (!sendAnswerData) {
        return <LoadingDiv>Loading...</LoadingDiv>;
    }

    return (
        <Container>
            <Board>보낸 💌</Board>
            <ContentsContainer>
                {sendAnswerData.length > 0 ? (
                    sendAnswerData.map(
                        (answer) => (
                            <AnswerDiv key={answer.commentIdx}>
                                <StatusContainer>
                                    <CreatedAt>{answer.worryCreatedAt}에 남긴 고민 👾</CreatedAt>
                                    <StatusText>
                                        {answer.isResolved ? "🚀 고민 해결 완료" : "🪐 고민 진행 중"}
                                    </StatusText>
                                </StatusContainer>
                                <WorryTitle>
                                    <button onClick={() => handleClick(answer.worryIdx)}>
                                        {answer.worryTitle}
                                    </button>
                                </WorryTitle>
                                <Comment
                                    key={answer.commentIdx}
                                    comment={answer}
                                    userId={userIdx}
                                    onEdit={handleCommentEdit}
                                    onDelete={handleCommentDelete}
                                />
                                <WorryLink>
                                    <button onClick={() => handleClick(answer.worryIdx)}>고민다시보기 ⇀</button>
                                </WorryLink>
                            </AnswerDiv>
                        )
                    )
                ):(
                    <div>보낸 답변이 없습니다.</div>
                )}
            </ContentsContainer>
        </Container>
    );
};

export default AnswerWorryBoard;


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
    height: calc(100vh - 200px);
    overflow-y: auto;
    border-radius: 10px;
    padding: 20px;
    scrollbar-width: none;
    box-sizing: border-box;
`;

const WorryTitle = styled.h3`
    padding: 0 10px;
    display: flex;
    align-items: center;
    & button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: inherit;
        font-weight: inherit;
        font-family: inherit;
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
    margin: 0;
    & button {
        align-self: end;
        background: none;
        border: none;
        cursor: pointer;
        font-size: inherit;
        font-weight: inherit;
        font-family: inherit;
        color: #4E2850;
        &:hover {
            color: #111731;
        }
    }
`;
