import React from "react";
import styled from "styled-components";
import SmallButton from "../button/SmallButton";


const DiaryComment = ({ comment = {}, onEdit, onDelete }) => {

    return (
        <CommentContainer>
            <CommentText>
                <span>{comment.creatAt || "(작성일시)"}</span>에 건넨 💌 <br />
                {comment.content}
            </CommentText>
            <CommentActions>
                <SmallButton onClick={() => onEdit(comment.commentIdx, prompt("수정할 내용을 입력하세요:", comment.content))}>
                            수정
                </SmallButton>
                <SmallButton onClick={() => onDelete(comment.commentIdx)}>
                            삭제
                </SmallButton>
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

