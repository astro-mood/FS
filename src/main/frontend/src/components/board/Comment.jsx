import React from "react";
import styled from "styled-components";
import useUserActions from "../../hooks/useUserActions";

const Comment = ({ comment, userId, onLike, onEdit, onDelete, onReport }) => {
    const { isMyComment } = useUserActions(userId, null, comment.ownerId);

    return (
        <CommentContainer>
            <CommentText>
                (작성일시)에 건넨 말 : <br /> {comment.text}
            </CommentText>
            <CommentActions>
                <Heart onClick={() => onLike(comment.id)}>❤️ {comment.likes}</Heart>
                {isMyComment ? (
                    <>
                        <EditButton onClick={() => onEdit(comment.id, "수정된 내용")}>
                            수정
                        </EditButton>
                        <DeleteButton onClick={() => onDelete(comment.id)}>삭제</DeleteButton>
                    </>
                ) : (
                    <MoreButton onClick={() => onReport(comment.id)}>...</MoreButton>
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
    gap: 10px;
    margin-top: 5px;
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

const EditButton = styled.button`
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;

    &:hover {
        background: #45a049;
    }
`;

const DeleteButton = styled.button`
    background: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;

    &:hover {
        background: #e53935;
    }
`;

const MoreButton = styled.button`
    background: #555;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;

    &:hover {
        background: #444;
    }
`;
