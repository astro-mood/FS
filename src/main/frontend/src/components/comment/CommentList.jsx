import React from "react";
import styled from "styled-components";
import Comment from "./Comment";

const CommentList = ({ comments, onLike, onEdit, onDelete, onReport, userId }) => {
    return (
        <CommentSection>
            <Title>위로의 말</Title>
            {comments.map((comment) => (
                <Comment
                    key={comment.id}
                    comment={comment}
                    userId={userId}
                    onLike={onLike}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onReport={onReport}
                />
            ))}
        </CommentSection>
    );
};

export default CommentList;

const Title = styled.h2`
    font-size: 1.2rem;
    color: black;
    margin-bottom: 10px;
`;

const CommentSection = styled.div`
    margin-top: 20px;
`;
