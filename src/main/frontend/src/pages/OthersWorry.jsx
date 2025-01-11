import React, { useState } from "react";
 import Title from "../components/board/PostTitle";
import Content from "../components/board/PostContent";
import CommentList from "../components/comment/CommentList";
import CommentInput from "../components/comment/CommentInput";
import styled from "styled-components";

const ViewWorry = ({ userId }) => {
    const [worry, setWorry] = useState(null);
    const [comments, setComments] = useState([
        { id: 1, text: "저도 그럴 때가 있었어요. 힘내세요!", ownerId: 2, likes: 15 },
        { id: 2, text: "공감합니다!", ownerId: 3, likes: 8 },
    ]);
    const [newComment, setNewComment] = useState(""); // 댓글 입력 상태

    const handleAddComment = () => {
        if (!newComment.trim()) return; // 빈 댓글 방지
        const newCommentData = {
            id: Date.now(), // 임시 ID (백엔드와 연동 시 수정 필요)
            text: newComment,
            ownerId: userId,
            likes: 0,
        };
        setComments((prev) => [...prev, newCommentData]);
        setNewComment("");
    };

    return (
        <Container>
            <Board>고민상담소</Board>
            <ContentsContainer>
            <Title title="코딩은 어려워" createdAt="2025-01-12" />
            <Content content="코딩은 정말 정말 어려워" />
            <CommentList
                comments={comments}
                userId={userId}
                onLike={(id) =>
                    setComments((prev) =>
                        prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
                    )
                }
                onEdit={(id, newText) =>
                    setComments((prev) =>
                        prev.map((c) => (c.id === id ? { ...c, text: newText } : c))
                    )
                }
                onDelete={(id) => setComments((prev) => prev.filter((c) => c.id !== id))}
                onReport={(id) => alert(`댓글 ${id} 신고 완료.`)}
            />
            <CommentInput
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onSubmit={handleAddComment}
            />
            </ContentsContainer>
        </Container>
    );
};

export default ViewWorry;

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