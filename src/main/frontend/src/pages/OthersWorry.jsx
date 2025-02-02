import React, { useEffect, useState } from "react";
import Title from "../components/board/PostTitle";
import Content from "../components/board/PostContent";
import CommentList from "../components/comment/CommentList";
import CommentInput from "../components/comment/CommentInput";
import styled from "styled-components";
import {
    getWorryByIdx,
    updateWorry,
    deleteWorry,
    resolveChangeWorry,
    getWorryComment,
    postWorryComment,
    updateWorryComment, deleteWorryComment, reportWorryComment
} from "../api/api";
import { useParams } from "react-router";
import { useUser } from "../context/UserContext";
import WorryEditForm from "../components/board/WorryEditForm";
import OwnerAction from "../components/button/EditDeleteButton";
import ResolveDropdown from "../components/dropdown/ResolveDropdown";
import {useModals} from "../context/ModalContext";
import {useNavigate} from "react-router";

const ViewWorry = () => {
    const { userIdx  } = useUser();

    const { worryIdx } = useParams();
    const [worry, setWorry] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedWorry, setEditedWorry] = useState({ title: "", content: "" });

    const [comments, setComments] = useState();
    const [newComment, setNewComment] = useState("");

    const { openModal } = useModals();
    const navigate = useNavigate();

    const fetchWorry = async () => {
        try {
            const response = await getWorryByIdx(worryIdx);
            setWorry(response.data);
            setEditedWorry({ title: response.data.title, content: response.data.content });
        } catch (error) {
            console.error("고민 데이터를 불러오는 데 실패했습니다.", error);
        }
    };

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedWorry((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async () => {
        openModal({
            type: "confirm",
            message: "정말로 수정하시겠습니까?",
            onConfirm: async () => {
                try {
                    const updatedData = {
                        ...worry, // 기존 worry의 모든 것 포함
                        title: editedWorry.title,
                        content: editedWorry.content,
                    };
            const response = await updateWorry(worryIdx, updatedData);
                    if (response.isSuccess) {
                        setWorry((prev) => ({ ...prev, ...updatedData }));
                        setIsEditing(false);
                        openModal({
                            type: "alert",
                            message: "수정이 완료되었습니다.",
                        });
                    } else {
                        openModal({ type: "alert", message: response.error.message || "수정에 실패했습니다. \n다시 시도해주세요." });
                    }
                } catch (error) {
                    openModal({ type: "alert", message: "수정에 실패했습니다. \n다시 시도해주세요." });
                }
            },
        });
    };

    const handleDelete = () => {
        openModal({
            type: "confirm",
            message: "정말로 삭제하시겠습니까?",
            onConfirm: async () => {
            try {
                const response = await deleteWorry(worryIdx);
                if (response.isSuccess) {
                    openModal({
                        type: "alert",
                        message: "삭제되었습니다.",
                        onConfirm: () => navigate("/boardworry"),
                    });
                } else {
                    openModal({
                        type: "alert",
                        message: response.error.message || "삭제에 실패했습니다. \n다시 시도해주세요." });
                }
            } catch (error) {
                openModal({
                    type: "alert",
                    message: "삭제에 실패했습니다. \n다시 시도해주세요." });
            }
            },
        });
    };


    const handleResolveChange = async (e) => {
        const newStatus = e.target.value === "해결 완료";
        openModal({
            type: "confirm",
            message: "정말 고민 상태를 변경하시겠습니까?",
            onConfirm: async () => {
                try {
                    await resolveChangeWorry(worryIdx, { isResolved: newStatus });
                    setWorry((prev) => ({ ...prev, isResolved: newStatus }));
                    openModal({ type: "alert", message: "상태가 변경되었습니다." });
                } catch (error) {
                    openModal({ type: "alert", message: "상태 변경에 실패했습니다. \n다시 시도해주세요." });
                }
            },
        });
    };

    // comment 관련
    // 댓글 데이터 불러오기
    const fetchWorryComment = async () => {
        try {
            const response = await getWorryComment(worryIdx)
            setComments(response.data.content);
        } catch (error) {
            console.error("댓글 데이터를 불러오는 데 실패했습니다.", error);
        }
    };

    useEffect(() => {
        if (worryIdx) {
            fetchWorry();
            fetchWorryComment();

        }
    }, [worryIdx]);

    if (!worry) {
        return <div>Loading...</div>;
    }

    const isOwner = userIdx === worry.userIdx; // 현재 사용자가 작성자인지 판단

    // 댓글 추가
    const handleAddComment = async () => {
        if (!newComment.trim())
            return;
        openModal({
            type: "confirm",
            message: "정말 댓글을 작성하시겠습니까?",
            onConfirm: async () => {
                try {
                    const data = { content: newComment };
                    await postWorryComment(worryIdx, data);
                    setNewComment("");
                    fetchWorryComment();
                    openModal({ type: "alert", message: "댓글이 작성되었습니다." });
                } catch (error) {
                    openModal({ type: "alert", message: "댓글 작성에 실패했습니다. \n다시 시도해주세요." });
                }
            },
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
            await updateWorryComment(commentIdx, { content: newContent });
            openModal({
                type: "alert",
                message: "댓글이 수정되었습니다." });
            fetchWorryComment();
        } catch (error) {
            openModal({
                type: "alert",
                message: "댓글 수정에 실패했습니다. \n다시 시도해주세요." });
        }
    };


    // 댓글 삭제
    const handleCommentDelete = async (commentIdx) => {
        openModal({
            type: "confirm",
            message: "정말로 삭제하시겠습니까?",
            onConfirm: async () => {
                try {
                    await deleteWorryComment(commentIdx);
                    fetchWorryComment();
                    openModal({ type: "alert", message: "댓글이 삭제되었습니다." });
                } catch (error) {
                    openModal({ type: "alert", message: "댓글 삭제에 실패했습니다. \n다시 시도해주세요." });
                }
            },
        });
    };

    // 댓글 신고
    const handleCommentReport = async (commentIdx) => {
        openModal({
            type: "confirm",
            message: "정말로 신고하시겠습니까?",
            onConfirm: async () => {
            try {
                await reportWorryComment(commentIdx);
                // fetchWorryComment();
                openModal({ type: "alert", message: "댓글이 신고되었습니다." });
            } catch (error) {
                openModal({ type: "alert", message: "댓글 신고에 실패했습니다. \n다시 시도해주세요." });
            }
            },
        });
    };

    return (
        <Container>
            <Board>고민상담소</Board>
            <ContentsContainer>
                {isEditing ? (
                    <WorryEditForm
                        editedWorry={editedWorry}
                        handleEditChange={handleEditChange}
                        handleEditSave={handleEditSave}
                        handleEditToggle={handleEditToggle}
                    />
                ) : (
                    <>
                        <Title title={worry.title} createdAt={worry.createdAt} />
                        <DropdownContainer>
                            <ViewCount>조회수: {worry.viewCount}</ViewCount>
                            {isOwner && !isEditing ? (
                                <ResolveDropdown
                                    onChange={handleResolveChange}
                                    isResolved={worry.isResolved}
                                />
                            ) : (
                                <StatusText>
                                    {worry.isResolved ? "🚀 고민 해결 완료" : "🪐 고민 진행 중"}
                                </StatusText>
                            )}
                        </DropdownContainer>
                        <Content content={worry.content} />
                    </>
                )}
                {isOwner && !isEditing && (
                    <OwnerAction
                        handleEditToggle={handleEditToggle}
                        handleDelete={handleDelete}
                    />
                )}
                <Spacer />
                <CommentList
                    comments={comments}
                    userIdx={userIdx}
                    onReport={handleCommentReport}
                    onEdit={handleCommentEdit}
                    onDelete={handleCommentDelete}
                />
                <CommentInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onSubmit={(content) => {
                        handleAddComment(content);
                    }}
                    placeholder="위로의 말을 건네세요."
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
    scrollbar-width: none;
`;

const Spacer = styled.div`
    height: 30px;
`;

const DropdownContainer = styled.h1`
    display: flex;
    justify-content: space-between; 
    align-items: center;
    margin: 10px 0;
`;

const ViewCount = styled.h1`
    color: #7A7A7A;
    font-size: 1rem;
    margin-bottom: 20px;
    text-align: left;
    margin: 0;
`;

const StatusText = styled.div`
  font-family: 'NeoDunggeunmo';
  font-size: 1rem;
  color: #535252;
  margin: 0;
`;