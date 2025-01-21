import React from "react";
import styled from "styled-components";
import Comment from "./Comment";
import DiaryComment from "./DiaryComment";

const CommentList = ({ comments, userIdx, isDiary, onLike, onEdit, onDelete,onReport, title = "위로의 말" }) => {

    return (
        <CommentSection>
            <Title>{title}</Title>
            {comments && comments.length > 0 ? (
                comments.map((comment) => (
                    isDiary ? (
                        <DiaryComment
                            key={comment.commentIdx}
                            comment={comment}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ) : (
                    <Comment
                        key={comment.commentIdx}
                        comment={comment}
                        userId={userIdx}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onReport={onReport}
                        onLike={onLike}
                    />
                    )
                ))
            ) : (
                <Nocomment>아직 남겨진 💌가 없습니다.</Nocomment>
            )}
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

const Nocomment = styled.h2`
    font-size: 0.9rem;
    color: #555555;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
`;