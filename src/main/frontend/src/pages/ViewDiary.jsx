import React, { useEffect, useState } from "react";
import Title from "../components/board/PostTitle";
import Content from "../components/board/PostContent";
import CommentList from "../components/comment/CommentList";
import CommentInput from "../components/comment/CommentInput";
import styled from "styled-components";
import {
    deleteDiary, deleteDiaryComment,
    getDiaryByIdx, getDiaryComment,
    postDiaryComment,
    updateDiary, updateDiaryComment,
} from "../api/api";
import { useParams } from "react-router";
import DiaryEditForm from "../components/board/DiaryEditForm";
import OwnerAction from "../components/button/EditDeleteButton";
import {useUser} from "../context/UserContext";
import {useModals} from "../context/ModalContext";
import {useNavigate} from "react-router";


const ViewDiary = () => {
    const { userIdx  } = useUser();
    const [editedComment, setEditedComment] =  useState({ id: null, content: "" });
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
    const { openModal } = useModals();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchDiary = async () => {
            try {
                const diaryData = await getDiaryByIdx(diaryIdx);
                setDiary(diaryData.data);
                setComments(diaryData.data.comments || []);
                setEmotions(diaryData.data.emotions || []);
                setEditedDiary({
                    title: diaryData.data.title || "",
                    content: diaryData.data.content || "",
                    emotions: diaryData.data.emotions?.map((e) => ({
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

    const handleEditToggle = () => setIsEditing((prev) => !prev);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedDiary((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async () => {
        openModal({
            type: "confirm",
            message: "정말로 수정하시겠습니까?",
            onConfirm: async () => {
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

                    if (response.isSuccess) {
                        // 바로 상태업데이트. 새로고침안해도 반영될 수 있게.
                        setDiary((prev) => ({
                            ...prev,
                            ...response.data,
                        }));
                        setEmotions(response.data.emotions || []);
                        setIsEditing(false);
                        openModal({
                            type: "alert",
                            message: "수정이 완료되었습니다.",
                        });
                    } else {
                        openModal({
                            type: "alert",
                            message: response.error.message || "수정에 실패했습니다. \n다시 시도해주세요.",
                        });
                    }
                } catch (error) {
                    openModal({
                        type: "alert",
                        message: "수정에 실패했습니다. \n다시 시도해주세요.",
                    });
                }
            }
        });
    };

        const handleDelete = () => {
            openModal({
                type: "confirm",
                message: "정말로 삭제하시겠습니까?",
                onConfirm: async () => {
            try {
                const response = await deleteDiary(diaryIdx);

                if (response.isSuccess) {
                    openModal({
                        type: "alert",
                        message: "삭제되었습니다.",
                        onConfirm: () => navigate("/mydiary"),
                    });
                } else {
                    openModal({
                        type: "alert",
                        message: response.error.message || "삭제에 실패했습니다. \n다시 시도해주세요.",
                    });
                }
            } catch (error) {
                openModal({
                    type: "alert",
                    message: "삭제에 실패했습니다. \n다시 시도해주세요.",
                });
            }
                },
            });
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

    //comment 관련
    // 댓글 데이터 불러오기
    const fetchDiaryComment = async () => {
        try {
            const response = await getDiaryComment(diaryIdx)
            setComments(response.data.content);
            console.log("diary comment", response)
        } catch (error) {
            console.error("댓글 데이터를 불러오는 데 실패했습니다.", error);
        }
    };

    useEffect(() => {
        if (diaryIdx) {
            fetchDiaryComment()
        }
    }, [diaryIdx]);

    if (!diary) {
        return <div>Loading...</div>;
    }

    // 댓글 추가
    const handleAddComment = async () => {
        if (!newComment.trim()) {
            openModal({
                type: "alert",
                message: "댓글을 입력하세요.",
            });
            return;
        }

        openModal({
            type: "confirm",
            message: "정말 댓글을 작성하시겠습니까?",
            onConfirm: async () => {
                try {
                    const data = { content: newComment };
                    const response = await postDiaryComment(diaryIdx, data);
                    setComments((prev) => [...prev, response]);
                    setNewComment("");
                    fetchDiaryComment();

                    openModal({
                        type: "alert",
                        message: "댓글이 작성되었습니다.",
                    });
                } catch (error) {
                    openModal({
                        type: "alert",
                        message: "댓글 작성에 실패했습니다. \n다시 시도해주세요.",
                    });
                }
            },
        });
    };

    // 댓글 수정
    const handleCommentEdit = async (commentIdx, newContent) => {
        if (!newContent.trim()) return;

        openModal({
            type: "confirm",
            message: "정말 댓글을 수정하시겠습니까?",
            onConfirm: async () => {
                try {
                    await updateDiaryComment(commentIdx, { content: newContent });
                    fetchDiaryComment();
                    setEditedComment({ id: null, content: "" });

                    openModal({
                        type: "alert",
                        message: "댓글이 수정되었습니다.",
                    });
                } catch (error) {
                    openModal({
                        type: "alert",
                        message: "댓글 수정에 실패했습니다. \n다시 시도해주세요.",
                    });
                }
            },
        });
    };

    // 댓글 삭제
    const handleCommentDelete = async (commentIdx) => {
        openModal({
            type: "confirm",
            message: "정말로 삭제하시겠습니까?",
            onConfirm: async () => {
                try {
                    await deleteDiaryComment(commentIdx);
                    fetchDiaryComment();
                    openModal({
                        type: "alert",
                        message: "댓글이 삭제되었습니다.",
                    });
                } catch (error) {
                    openModal({
                        type: "alert",
                        message: "댓글 삭제에 실패했습니다. \n다시 시도해주세요.",
                    });
                }
            },
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
                            title="이때의 나에게 건넨 말"
                            comments={comments}
                            userIdx={userIdx}
                            onEdit={handleCommentEdit}
                            onDelete={handleCommentDelete}
                            isDiary={true}
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
