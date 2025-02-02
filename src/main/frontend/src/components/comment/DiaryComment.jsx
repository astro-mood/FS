import React, {useState} from "react";
import styled from "styled-components";
import SmallButton from "../button/SmallButton";
import {useModals} from "../../context/ModalContext";
import CommentInput from "./CommentInput";


const DiaryComment = ({ comment = {}, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const {openModal} = useModals()

    const handleEditStart = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    };

    const handleEditSubmit = () => {
        if (!editedContent.trim()) {
            openModal({
                type: "alert",
                message: "작성된 댓글이 없습니다." });
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
                <span>{comment.creatAt || "(작성일시)"}</span>에 건넨 💌 <br />
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
                {isEditing ? (
                    <>
                    </>
                ) : (
                    <>
                        <SmallButton onClick={handleEditStart}>수정</SmallButton>
                        <SmallButton onClick={() => onDelete(comment.commentIdx)}>삭제</SmallButton>
                    </>
                )}
            </CommentActions>
        </CommentContainer>
    );
};

export default DiaryComment;

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

