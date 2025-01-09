import React from "react";
import styled from "styled-components";

const ConfirmModal = ({ isOpen, message, onConfirm }) => {
    if (!isOpen) return null; // 모달이 열리지 않은 경우 렌더링하지 않음

    return (
        <Overlay>
            <ModalContainer>
                <Message>{message}</Message>
                <ButtonContainer>
                    <Button onClick={onConfirm}>확인</Button>
                </ButtonContainer>
            </ModalContainer>
        </Overlay>
    );
};

export default ConfirmModal;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background: white;
    border-radius: 8px;
    width: 300px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Message = styled.p`
    font-size: 1rem;
    margin-bottom: 20px;
    color: #333;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
`;

const Button = styled.button`
    background-color: #7d8dde;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 0.9rem;
    font-family: "NeoDunggeunmo";

    &:hover {
        background-color: #4e2850;
    }
`;
