import React from "react";
import styled from "styled-components";

const Content = ({ content }) => {
    return (
        <ContentContainer>
            <p>{content}</p>
        </ContentContainer>
    );
};

export default Content;

const ContentContainer = styled.div`
    background: #f9f9f9;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;

    p {
        font-size: 1.2rem;
        line-height: 1.5;
        color: #555;
    }
`;
