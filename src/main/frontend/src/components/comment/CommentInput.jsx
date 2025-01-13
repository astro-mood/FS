import React from "react";
import styled from "styled-components";

const CommentInput = ({ value, onChange, onSubmit, placeholder }) => {
    return (
        <CommentInputContainer>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            <AddButton onClick={onSubmit}>등록</AddButton>
        </CommentInputContainer>
    );
};

export default CommentInput;

const CommentInputContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Input = styled.textarea`
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    font-size: 1rem;
    font-family: 'NeoDunggeunmo';
    scrollbar-width: none;

`;

const AddButton = styled.button`
    background: #7d8dde;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    height: 55px;
    font-family: 'NeoDunggeunmo';
    
    &:hover {
        background: #4e2850;
    }
`;
