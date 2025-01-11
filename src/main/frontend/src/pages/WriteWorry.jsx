import React, { useState } from "react";
import styled from "styled-components";
import WriteButton from "../components/button/WriteButton";
import { useNavigate } from "react-router";
import { postWorry } from "../api/api";
import Modal from "../components/modal/Modal";
import ConfirmModal from "../components/modal/ConfirmModal";
import ContentTitle from "../components/write/ContentTitle";
import Content from "../components/write/Content";

const WriteWorry = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // Confirm 모달 관련
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    // 모달 관련
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handleSubmit = async () => {
        if (!title || !content) {
            setConfirmModalMessage("제목과 내용을 입력해주세요!");
            setIsConfirmModalOpen(true);
            return;
        }

        try {
            await postWorry({ title, content });
            setModalMessage("작성이 완료되었습니다!");
            setIsModalOpen(true);
        } catch (error) {
            setConfirmModalMessage("데이터 전송에 실패했습니다. 다시 시도해주세요.");
            setIsConfirmModalOpen(true);
        }
    };

    const handleConfirm = () => {
        setIsConfirmModalOpen(false); // 확인 모달 닫기
        navigate("/boardworry"); // 게시판으로 이동
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsConfirmModalOpen(false);
    };

    return (
        <Container>
            <Title>고민글 쓰기</Title>
            <ContentsContainer>
                <ContentTitle
                    placeholder="제목을 입력해주세요."
                    title={title}
                    setTitle={setTitle} />
                <Content
                    placeholder="마음에 담아두었던 고민을 작성해주세요."
                    content={content}
                    setContent={setContent} />
            </ContentsContainer>
            <WriteButton text="작성 완료!" onClick={handleSubmit} />

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                message={confirmModalMessage}
                onConfirm={handleCancel}
            />

            <Modal
                isOpen={isModalOpen}
                message={modalMessage}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </Container>
    );
};

export default WriteWorry;

const Container = styled.div`
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin-top: -20px;
`;

const ContentsContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    gap: 16px;
`;

const Title = styled.h1`
    color: white;
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: left;
    font-family: "NeoDunggeunmo";
`;