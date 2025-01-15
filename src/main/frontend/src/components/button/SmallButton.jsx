import React from "react";
import styled from "styled-components";

const SmallButton = ({ onClick, children }) => {
    return <StyledButton onClick={onClick}>{children}</StyledButton>;
};

export default SmallButton;

const StyledButton = styled.button`
    background: none;
    border: none;
    color: #7A7A7A;
    cursor: pointer;
    font-family: 'NeoDunggeunmo';
    font-weight: bold;

    &:hover {
        text-decoration: underline;
    }
`;
