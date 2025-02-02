import React, {useState} from "react";
import styled from "styled-components";
import {useUser} from "../../context/UserContext";
import {commentLike} from "../../api/api";
import SmallButton from "../button/SmallButton";
import CommentInput from "./CommentInput";
import {useModals} from "../../context/ModalContext";

const Comment = ({ comment = {}, onLike=true, onEdit, onDelete, onReport, isDiary }) => {
    const { userIdx } = useUser();
    const isMyComment = userIdx === comment.userIdx;
    const [liked, setLiked] = useState(comment.isLiked || false);
    const [likeCount, setLikeCount] = useState(comment.likeCount || 0);

    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const {openModal} = useModals()

    const handleLike = async () => {
        try {
            const response = await commentLike(comment.commentIdx);
            setLiked((prev) => !prev);
            setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
        } catch (error) {
            console.error("좋아요 처리 중 오류 발생:", error);
        }
    };

    const handleEditStart = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    };

    const handleEditSubmit = () => {
        if (!editedContent.trim()) {
            openModal({ type: "alert", message: "작성된 댓글이 없습니다." });
            return;
        }

        openModal({
            type: "confirm",
            message: "정말 댓글을 수정하시겠습니까?",
            onConfirm: async () => {
                onEdit(comment.commentIdx, editedContent);
                setIsEditing(false);
            },
        });
    };


    return (
        <CommentContainer>
            <CommentText>
                <span>{comment.createdAt || "(작성일시)"}</span>에 건넨 💌 <br />
                {isEditing ? (
                    <CommentInput
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        onSubmit={handleEditSubmit}
                        placeholder="댓글을 수정하세요."
                    />
                ) : (
                    <>{comment.content}</>
                )}
            </CommentText>

            <CommentActions>
                {onLike && !isEditing &&(
                    <Heart onClick={handleLike}>
                        {liked ? "❤️" : "🤍"} {likeCount}
                    </Heart>
                )}
                {isMyComment ? (
                    isEditing ? (
                        <>
                        </>
                    ) : (
                        <>
                            <SmallButton onClick={handleEditStart}>수정</SmallButton>
                            <SmallButton onClick={() => onDelete(comment.commentIdx)}>삭제</SmallButton>
                        </>
                    )
                ) : (
                    !isDiary && (
                        <SmallButton onClick={() => onReport(comment.commentIdx)}>신고</SmallButton>
                    )
                )}
            </CommentActions>
        </CommentContainer>
    );
};

export default Comment;

const CommentContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: #f9f9f9;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
`;

const CommentText = styled.div`
    font-size: 1rem;
    color: #555;
    white-space: pre-wrap;
`;

const CommentActions = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    margin-top: -10px;
`;

const Heart = styled.button`
    background: transparent;
    border: none;
    color: red;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
        opacity: 0.8;
    }
`;