import React, { useState } from "react";
import Title from "../components/board/PostTitle";
import Content from "../components/board/PostContent";
import CommentList from "../components/comment/CommentList";
import CommentInput from "../components/comment/CommentInput";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

const ViewDiary = ({ userId }) => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const rawDate = params.get("date"); // YYYY-MM-DD 형식의 날짜 추출
    // 년-월-일로 변경
    let formattedDate = rawDate;
    if (rawDate) {
        const [year, month, day] = rawDate.split("-");
        formattedDate = `${year}년 ${month}월 ${day}일`;
    }

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState(""); // 댓글 입력 상태

    const handleAddComment = () => {
        if (!newComment.trim()) return; // 빈 댓글 방지
        const newCommentData = {
            id: Date.now(), // 임시 ID (백엔드와 연동 시 수정 필요)
            text: newComment,
            ownerId: userId,
            likes: 0,        };
        setComments((prev) => [...prev, newCommentData]);
        setNewComment("");
    };


    return (
        <Container>
            <Board> {formattedDate} 일기</Board>
            <ContentsContainer>
                <Title title="코딩은 어려워"/>
                <div style={{height: '20px'}}/>

                <Content content="코딩은 정말 정말 어려워"/>
                <Spacer />
                <CommentList
                    comments={comments}
                    userId={userId}
                    onLike={(id) =>
                        setComments((prev) =>
                            prev.map((c) => (c.id === id ? {...c, likes: c.likes + 1} : c))
                        )
                    }
                    onEdit={(id, newText) =>
                        setComments((prev) =>
                            prev.map((c) => (c.id === id ? {...c, text: newText} : c))
                        )
                    }
                    onDelete={(id) => setComments((prev) => prev.filter((c) => c.id !== id))}
                    title="이때의 나에게 건넨 말"
                />
                <CommentInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onSubmit={handleAddComment}
                    placeholder="지금의 나를 전하세요."
                />
            </ContentsContainer>
        </Container>
    );
};

export default ViewDiary;

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
    scrollbar-width: none; // 스크롤바 안보이기
`;

const Spacer = styled.div`
  height: 30px; 
`;