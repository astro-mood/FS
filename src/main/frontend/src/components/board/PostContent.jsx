import React from "react";
import styled from "styled-components";

const Content = ({ content }) => {
    return (
        <ContentContainer>
            <div>{content}</div>
        </ContentContainer>
    );
};

export default Content;

const ContentContainer = styled.div`
    background: #f9f9f9;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;

    div {
        font-size: 1.2rem;
        line-height: 1.5;
        color: #555;
        white-space: pre-wrap;
    }
`;
