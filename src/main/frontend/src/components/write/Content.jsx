import React from "react";
import styled from "styled-components";


const Content = ({ content, setContent, placeholder }) => {

    return (
        <Container>
            <InputLabel>내용</InputLabel>
            <ContentInput
                placeholder={placeholder}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </Container>
    );
};

export default Content;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
`;

const InputLabel = styled.label`
    font-size: 1.2rem;
    margin-bottom: 10px;
    display: block;
    font-family: "NeoDunggeunmo";
`;

const ContentInput = styled.textarea`
    border: none;
    border-bottom: 2px solid #ccc;
    font-size:  1.2rem;
    padding: 8px;
    resize: none;
    outline: none;
    font-family: "NeoDunggeunmo";
    height: calc(100vh - 307px); // 하단 여백
    border-radius: 5px;
    overflow-y: auto;
    scrollbar-width: none; // 스크롤바 안보이게 하기        
`;
