import React, { useState } from "react";
import styled from "styled-components";
import Comment from "../components/board/Comment";

const ViewWorry = ({ userId }) => {
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
            <Title>고민상담소</Title>
            <Content>
                <ContentWrapper>
                    <InputLabel>제목 : 코딩은 어려워</InputLabel>
                    <ContentText>코딩은 정말 정말 어려워 코딩은 정말 정말 어려워코딩코딩은 정말 정말코딩은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 코딩은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워코딩은 정말 정말 어려워</ContentText>
                    <CommentsSection>
                        <Subtitle>위로의 말</Subtitle>
                        {comments.map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                userId={userId}
                                onLike={(id) =>
                                    setComments((prev) =>
                                        prev.map((c) =>
                                            c.id === id ? { ...c, likes: c.likes + 1 } : c
                                        )
                                    )
                                }
                                onEdit={(id, newText) =>
                                    setComments((prev) =>
                                        prev.map((c) =>
                                            c.id === id ? { ...c, text: newText } : c
                                        )
                                    )
                                }
                                onDelete={(id) =>
                                    setComments((prev) => prev.filter((c) => c.id !== id))
                                }
                                onReport={(id) => alert(`댓글 ${id} 신고 완료.`)}
                            />
                        ))}
                        <CommentInputContainer>
                            <CommentInput
                                placeholder="위로의 말을 건네세요."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <AddButton onClick={handleAddComment}>등록</AddButton>
                        </CommentInputContainer>
                    </CommentsSection>
                </ContentWrapper>
            </Content>
        </Container>
    );
};

export default ViewWorry;

const Container = styled.div`
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin: auto;
`;

const Title = styled.h1`
    color: white;
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: left;
`;

const ContentWrapper = styled.div`
    margin: 0 auto;
    max-width: 1000px;
    display: flex;
    flex-direction: column; /* 자식 요소가 세로로 배치되도록 설정 */
`;

const Content = styled.div`
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    flex: 1; /* 부모 요소(ContentWrapper)의 높이를 채우도록 설정 */
`;

const InputLabel = styled.div`
    font-size: 1.2rem;
    color: black;
    margin-bottom: 10px;
`;

const ContentText = styled.p`
    font-size: 1rem;
    color: #555;
    background: #f9f9f9;
    padding: 10px;
    border-radius: 5px;
    line-height: 1.5;
    margin-bottom: 20px;
`;

const CommentsSection = styled.div`
    margin-top: 20px;
`;

const Subtitle = styled.h2`
    font-size: 1.2rem;
    color: black;
    margin-bottom: 10px;
`;

const CommentInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  font-size: 1rem;
  font-family: 'NeoDunggeunmo';  
`;

const AddButton = styled.button`
  background: #7D8DDE;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
    height: 40px;
    font-family: 'NeoDunggeunmo';


    &:hover {
    background: #4E2850;
  }
`;
