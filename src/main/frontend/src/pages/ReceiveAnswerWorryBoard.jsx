import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUser } from '../context/UserContext';
import {getReceiveAnswer, reportWorryComment, readNotices, readNoticesByUser} from "../api/api";
import { useNavigate } from "react-router";
import Comment from "../components/comment/Comment";

const ReceiveAnswerWorryBoard = () => {
    const navigate = useNavigate();
    const { userIdx } = useUser();
    const [receiveAnswerData, setReceiveAnswerData] = useState([]);
    const [isAllRead, setIsAllRead] = useState(false); // 전체 읽음 상태 추가

    //댓글 페이징추가
    const [loading, setLoading] = useState(false);
    const [nextCommentId, setNextCommentId] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    //커서페이징
    const fetchReceiveAnswerData = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await getReceiveAnswer(userIdx, nextCommentId);
            if(nextCommentId === null){
                setReceiveAnswerData(response.data.items);
            }else{
                setReceiveAnswerData((prev) => [...prev, ...response.data.items]);
            }
            setNextCommentId(response.data.nextCursor);
            setHasMore(response.data.hasNextPage);
        } catch (error) {
            console.error("받은 답변보기 데이터를 불러오는데 실패했습니다. ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // userIdx가 undefined인 경우 처리
        if (!userIdx) {
            console.log("사용자 정보가 없습니다.");
            return; // 더 이상 진행하지 않음
        }
        fetchReceiveAnswerData();
    }, [userIdx]);


    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore) {
            fetchReceiveAnswerData();
        }
    };

    // 댓글 신고
    const handleCommentReport = async (commentIdx) => {
        if (window.confirm("정말 신고하시겠습니까?")) {
            try {
                console.log("신고 요청 데이터:", { commentIdx }); // 요청 데이터 로그
                await reportWorryComment(commentIdx);
                console.log("신고 성공:");
                alert("댓글이 신고되었습니다.");
            } catch (error) {
                console.error("댓글 신고에 실패했습니다.", error);
            }
        }
    };
    const handleClick = async (worryIdx) => {
        //해당 댓글 읽음처리하기
        try {
            await readNotices("comment", worryIdx);
            navigate(`/worry/${worryIdx}`); //고민 페이지 이동
        } catch (error) {
            console.error("읽음 처리에 실패했습니다. ", error);
            throw error;
        }
    };
    const handleBtnClick = async () => {
        //전체 읽음 처리
        try {
            await readNoticesByUser("comment");
            setIsAllRead(true);
        } catch (error) {
            console.error("전체 읽음 처리에 실패했습니다. ", error);
            throw error;
        }
    };

    if (!receiveAnswerData) {
        return <LoadingDiv>Loading...</LoadingDiv>;
    }

    return (
        <Container>
            <Board>받은 💌</Board>
            {receiveAnswerData.length > 0 && !receiveAnswerData[0].isRead && (
                <ReadButton onClick={() => handleBtnClick()}>전체 읽음 확인</ReadButton>
            )}
            <ContentsContainer onScroll={handleScroll}>
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
                                <WorryTitle>
                                    {!isAllRead && answer.isRead != null && !answer.isRead && <IsRead />}
                                    <button onClick={() => handleClick(answer.worryIdx)} >
                                        {answer.worryTitle}
                                    </button>
                                </WorryTitle>
                                <Comment
                                    key={answer.commentIdx}
                                    comment={answer}
                                    userId={userIdx}
                                    onReport={handleCommentReport}
                                />
                                <WorryLink>
                                    <button onClick={() => handleClick(answer.worryIdx)}>고민다시보기 ⇀</button>
                                </WorryLink>
                            </AnswerDiv>
                        )
                    )
                ):(
                    <div>받은 답변이 없습니다.</div>
                )}
                {loading && receiveAnswerData.length > 0 && <p>불러오는 중...</p>}
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

const IsRead = styled.span`
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #963B74;
    border-radius: 50%;
    margin-right: 5px;
`;
const ReadButton = styled.button`
    border: none;
    outline: none;
    color:#fff;
    background-color: #7D8DDE;
    padding: 10px 15px;
    margin-right: 20px;
    margin-bottom: 10px;
    cursor: pointer;
    display: block;
    align-self: end;
    border-radius: 5px;
    font-family: inherit;
    &:hover {background-color:#4E2850;}
`;