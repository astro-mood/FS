import React, {useEffect, useState} from "react";
import Title from "../components/board/PostTitle";
import Content from "../components/board/PostContent";
import CommentList from "../components/comment/CommentList";
import CommentInput from "../components/comment/CommentInput";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import {getDiaryByIdx} from "../api/api";

const ViewDiary = ({ userId, diary_idx }) => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [diary, setDiary] = useState([]);



    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState(""); // 댓글 입력 상태
    const [emotions, setEmotions] = useState([
        { emoji: "😊", description: "기쁨", userScore: 8 },
        { emoji: "😢", description: "슬픔", userScore: 2 }
]);

    // 일기 데이터 가져오기
    useEffect(() => {
        const fetchDiary = async () => {
            try {
                const diaryData = await getDiaryByIdx(diary_idx);
                setDiary(diaryData);
                setComments(diaryData.comments || []);
                setEmotions(diaryData.emotions || []);
            } catch (error) {
                console.error("일기 데이터를 가져오는 중 오류 발생:", error);
            }
        };

        fetchDiary();
    }, [diary_idx]);

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
            <Board> 일기</Board>
            <ContentsContainer>
                <Title title="코딩은 어려워" />
                <div style={{ height: '20px' }} />
                <EmotionSection>
                    <EmotionTitle>이날의 감정지수</EmotionTitle>
                    <EmotionList>
                        {emotions.map((emotion, index) => (
                            <EmotionItem key={index}>
                                <Emoji>{emotion.emoji}</Emoji>
                                <Description>{emotion.description} {emotion.userScore}점</Description>
                            </EmotionItem>
                        ))}
                    </EmotionList>
                </EmotionSection>
                <Content content="코딩은 정말 정말 어려워" />

                <Spacer />
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

const EmotionSection = styled.div`
    margin: 20px 0;
`;

const EmotionTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: #333;
    display: flex;
    flex-direction: row;
`;

const EmotionList = styled.div`
    background: #f9f9f9;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 50px;

`;

const EmotionItem = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const Emoji = styled.div`
    font-size: 2rem;
`;

const Description = styled.div`
    margin-top: 5px;
    color: #555;
    font-size: 1.5rem;
    gap : 30px;
`;

const Spacer = styled.div`
    height: 30px;
`;
