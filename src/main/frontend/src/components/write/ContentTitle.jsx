import React from "react";
import styled from "styled-components";

const ContentTitle = ({ title, setTitle, placeholder }) => {

    return (
        <Container>
            <InputLabel>제목</InputLabel>
            <TitleInput
                placeholder={placeholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
        </Container>
    );
};

export default ContentTitle;

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

const TitleInput = styled.input`
    padding: 8px;
    font-size:  1.2rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    font-family: "NeoDunggeunmo";
`;

