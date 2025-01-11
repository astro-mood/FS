import React from "react";
import styled from "styled-components";

const WriteButton = ({
                         text,
                         onClick,
                         size = "medium",
                         color = "#7D8DDE",
                         position = { bottom: "50px", right: "100px" }, // 기본 값 설정
                     }) => {
    return (
        <StyleButton onClick={onClick} size={size} color={color} position={position}>
            {text}
        </StyleButton>
    );
};

export default WriteButton;

const StyleButton = styled.button`
    position: fixed;
    bottom: ${({ position }) => position.bottom || "50px"}; // props에서 위치를 이동해서 사용할 수 있게
    right: ${({ position }) => position.right || "50px"}; 
    background-color: ${({ color }) => color};
    background-color: ${({ color }) => color};
    color: white;
    border: none;
    border-radius: 50px;
    padding: ${({ size }) => (size === "large" ? "20px 40px" : "15px 30px")};
    font-size: ${({ size }) => (size === "large" ? "1.2rem" : "1rem")};
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.2s, transform 0.2s;
    font-family: 'NeoDunggeunmo';


    &:hover {
        background-color: ${({ color }) => (color === "#7D8DDE" ? "#4E2850" : "#333333")};
        transform: scale(1.05);
    }
`;