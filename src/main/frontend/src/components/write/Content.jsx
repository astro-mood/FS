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
    flex: 1;  // 부모의 남은 공간을 채우도록 하는 것, 부모요소에 flexbox 설정 해놔야 함
`;

const InputLabel = styled.label`
    font-size: 1.2rem;
    margin-bottom: 10px;
    display: block;
    font-family: "NeoDunggeunmo";
    color: black;
`;

const ContentInput = styled.textarea`
    background-color: #F9F9F9;
    padding: 8px;
    font-size:  1.2rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    resize: none;
    font-family: "NeoDunggeunmo";
    height: calc(100vh - 352px); // 하단 여백
    overflow-y: auto;
    scrollbar-width: none; // 스크롤바 안보이게 하기       
    //flex: 1; // 부모의 남은 공간을 채우도록 하는 것 
`;
