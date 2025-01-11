import React from "react";
import styled from "styled-components";

const Title = ({ title, createdAt }) => {
    return (
        <TitleContainer>
            <h1>{title}</h1>
            <p>{createdAt} 에 남긴 📩</p>
        </TitleContainer>
    );
};

export default Title;

const TitleContainer = styled.div`
    margin-bottom: 20px;

    h1 {
        font-size: 1.8rem;
        color: black;
    }

    p {
        font-size: 0.9rem;
        color: gray;
    }
`;