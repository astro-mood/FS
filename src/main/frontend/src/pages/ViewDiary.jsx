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

    //댓글 페이징추가
    const [loading, setLoading] = useState(false);
    const [nextCommentId, setNextCommentId] = useState(null);
    const [hasMore, setHasMore] = useState(true);


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
        if (!editedDiary.title.trim() || !editedDiary.content.trim()) {
            openModal({
                type: "alert",
                message: "제목과 내용을 입력해주세요!",
            });
            return;
        }

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
                            message: response.error.message || "수정에 실패했습니다.",
                        });
                    }
                } catch (error) {
                    if (error.response && error.response.data) {
                        const { error: serverError } = error.response.data;

                        if (serverError && serverError.message) {
                            openModal({
                                type: "alert",
                                message: serverError.message || "수정에 실패했습니다.",
                            });
                            return;
                        }
                    }

                    openModal({
                        type: "alert",
                        message: "에러가 발생했습니다.",
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
                        message: response.error.message || "삭제에 실패했습니다.",
                    });
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    const { error: serverError } = error.response.data;

                    if (serverError && serverError.message) {
                        openModal({
                            type: "alert",
                            message: serverError.message || "삭제에 실패했습니다.",
                        });
                        return;
                    }
                }

                openModal({
                    type: "alert",
                    message: "에러가 발생했습니다.",
                });
            }
                }
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
    // 댓글 데이터 불러오기 //커서페이징
    const fetchDiaryComment = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await getDiaryComment(diaryIdx, nextCommentId);
            if(nextCommentId === null){
                setComments(response.data.items);
            }else{
                setComments((prev) => [...prev, ...response.data.items]);
            }
            setNextCommentId(response.data.nextCursor);
            setHasMore(response.data.hasNextPage);
        } catch (error) {
            console.error("댓글 데이터를 불러오는 데 실패했습니다.", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (diaryIdx) {
            setComments([]);
            setNextCommentId(null);
            setHasMore(true);
            fetchDiaryComment();
        }
    }, [diaryIdx]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore) {
            fetchDiaryComment();
        }
    };

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
                    console.log(response);
                    setComments((prev) => [...prev, response.data]);
                    setNewComment("");
                    fetchDiaryComment();
                    // 댓글 추가 후 스크롤을 조정합니다.
                    const container = document.querySelector("#contents-container");
                    if (container) {
                        container.scrollTop = container.scrollHeight; // 마지막 댓글로 스크롤
                    }
                    openModal({
                        type: "alert",
                        message: "댓글이 작성되었습니다.",
                    });
                } catch (error) {
                    if (error.response && error.response.data) {
                        const { error: serverError } = error.response.data;

                        if (serverError && serverError.message) {
                            openModal({
                                type: "alert",
                                message: serverError.message || "댓글 작성에 실패했습니다.",
                            });
                            return;
                        }
                    }

                    openModal({
                        type: "alert",
                        message: "에러가 발생했습니다.",
                    });
                }
            }
        });
    };

    // 댓글 수정
    const handleCommentEdit = async (commentIdx, newContent) => {
        // ui에 먼저 반영하기 위해
        setComments((prev) =>
            prev.map((comment) =>
                comment.commentIdx === commentIdx ? { ...comment, content: newContent } : comment
            )
        );

        try {
            await updateDiaryComment(commentIdx, { content: newContent });
            openModal({
                type: "alert",
                message: "댓글이 수정되었습니다." });
            fetchDiaryComment();
        } catch (error) {
            if (error.response && error.response.data) {
                const { error: serverError } = error.response.data;

                if (serverError && serverError.message) {
                    openModal({
                        type: "alert",
                        message: serverError.message || "댓글 수정에 실패했습니다.",
                    });
                    return;
                }
            }

            openModal({
                type: "alert",
                message: "에러가 발생했습니다.",
            });
        }
    };

    // 댓글 삭제
    const handleCommentDelete = async (commentIdx) => {
        openModal({
            type: "confirm",
            message: "정말로 삭제하시겠습니까?",
            onConfirm: async () => {
                try {
                    await deleteDiaryComment(commentIdx);
                    // 댓글 목록에서 해당 댓글 제거
                    setComments((prev) => prev.filter(comment => comment.commentIdx !== commentIdx));

                    // fetchDiaryComment();
                    openModal({
                        type: "alert",
                        message: "댓글이 삭제되었습니다.",
                    });
                } catch (error) {
                    if (error.response && error.response.data) {
                        const { error: serverError } = error.response.data;

                        if (serverError && serverError.message) {
                            openModal({
                                type: "alert",
                                message: serverError.message || "댓글 삭제에 실패했습니다.",
                            });
                            return;
                        }
                    }

                    openModal({
                        type: "alert",
                        message: "에러가 발생했습니다.",
                    });
                }
            }
        });
    };


    if (!diary) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Board>{diary.createdAt} 일기</Board>
            <ContentsContainer onScroll={handleScroll}>
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
                        {loading && <p>댓글을 불러오는 중...</p>}
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