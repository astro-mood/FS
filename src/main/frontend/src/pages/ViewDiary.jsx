import React, { useEffect, useState } from "react";
import Title from "../components/board/PostTitle";
import Content from "../components/board/PostContent";
import CommentList from "../components/comment/CommentList";
import CommentInput from "../components/comment/CommentInput";
import styled from "styled-components";
import { deleteDiary, getDiaryByIdx, updateDiary } from "../api/api";
import { useParams } from "react-router";
import DiaryEditForm from "../components/board/DiaryEditForm";
import OwnerAction from "../components/button/EditDeleteButton";

const ViewDiary = ({ userId }) => {
    const { diaryIdx } = useParams();
    const [diary, setDiary] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [emotions, setEmotions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDiary, setEditedDiary] = useState({
        title: "",
        content: "",
        emotions: [],
    });

    useEffect(() => {
        const fetchDiary = async () => {
            try {
                const diaryData = await getDiaryByIdx(diaryIdx);
                setDiary(diaryData);
                setComments(diaryData.comments || []);
                setEmotions(diaryData.emotions || []);
                setEditedDiary({
                    title: diaryData.title || "",
                    content: diaryData.content || "",
                    emotions: diaryData.emotions?.map((e) => ({
                        emotion: e.emoji,
                        score: e.userScore,
                        emotionIdx: e.emotionIdx,
                    })) || [],
                });
            } catch (error) {
                console.error("일기 데이터를 가져오는 중 오류 발생:", error);
            }
        };

        fetchDiary();
    }, [diaryIdx]);

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        const newCommentData = {
            id: Date.now(),
            text: newComment,
            ownerId: userId,
            likes: 0,
        };
        setComments((prev) => [...prev, newCommentData]);
        setNewComment("");
    };

    const handleEditToggle = () => setIsEditing((prev) => !prev);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedDiary((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async () => {
        try {
            const updatedData = {
                title: editedDiary.title,
                content: editedDiary.content,
                emotions: editedDiary.emotions.map((emotion) => ({
                    emotionIdx: emotion.emotionIdx,
                    userScore: emotion.score,
                })),
            };

            const response = await updateDiary(diaryIdx, updatedData);

            // 바로 상태업데이트. 새로고침안해도 반영될 수 있게.
            setDiary((prev) => ({
                ...prev,
                title: response.title,
                content: response.content,
                emotions: response.emotions,
            }));
            setEmotions(response.emotions || []);

            setIsEditing(false);
            alert("수정되었습니다.");
        } catch (error) {
            console.error("수정에 실패했습니다.", error);
            alert("수정에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                await deleteDiary(diaryIdx);
                alert("삭제되었습니다.");
                window.location.href = "/mydiary";
            } catch (error) {
                console.error("삭제에 실패했습니다.", error);
                alert("삭제에 실패했습니다. 다시 시도해주세요.");
            }
        }
    };

    const handleEmotionChange = (index, field, value, emotionIdx) => {
        setEditedDiary((prev) => {
            const updatedEmotions = [...prev.emotions];
            updatedEmotions[index] = {
                ...updatedEmotions[index],
                [field]: value,
                emotionIdx: emotionIdx ?? updatedEmotions[index].emotionIdx,
            };
            return { ...prev, emotions: updatedEmotions };
        });
    };

    const addEmotionScore = () => {
        setEditedDiary((prev) => ({
            ...prev,
            emotions: [...prev.emotions, { emotion: "", score: 0 }],
        }));
    };

    const removeEmotionScore = (index) => {
        setEditedDiary((prev) => {
            const updatedEmotions = prev.emotions.filter((_, idx) => idx !== index);
            return { ...prev, emotions: updatedEmotions };
        });
    };

    return (
        <Container>
            <Board>{diary.createdAt} 일기</Board>
            <ContentsContainer>
                {isEditing ? (
                    <DiaryEditForm
                        editedDiary={editedDiary}
                        handleEditChange={handleEditChange}
                        handleEditSave={handleEditSave}
                        handleEditToggle={handleEditToggle}
                        handleEmotionChange={handleEmotionChange}
                        addEmotionScore={addEmotionScore}
                        removeEmotionScore={removeEmotionScore}
                    />
                ) : (
                    <>
                        <Title title= {diary.title} />
                        <EmotionSection>
                            <Subtitle>이날의 감정지수</Subtitle>
                            <EmotionList>
                                {emotions.map((emotion, index) => (
                                    <EmotionItem key={index}>
                                        <Emoji>{emotion.emoji}</Emoji>
                                        <Description>{emotion.description} {emotion.userScore}점</Description>
                                    </EmotionItem>
                                ))}
                            </EmotionList>
                        </EmotionSection>
                        <Subtitle>이날의 이야기</Subtitle>
                        <Content content={diary.content} />
                        <OwnerAction
                            handleEditToggle={handleEditToggle}
                            handleDelete={handleDelete}
                        />
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
                    </>
                )}
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
    scrollbar-width: none;
`;

const EmotionSection = styled.div`
    margin: 20px 0;
`;

const Subtitle = styled.h2`
    font-size: 1.4rem;
    margin-bottom: 10px;
    color: #404040;
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
    font-size: 1.8rem;
`;

const Description = styled.div`
    margin-top: 5px;
    color: #555;
    font-size: 1.3rem;
    gap: 20px;
`;

const Spacer = styled.div`
    height: 30px;
`;
