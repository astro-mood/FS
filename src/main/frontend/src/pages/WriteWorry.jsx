import React, { useState } from "react";
import styled from "styled-components";
import WriteButton from "../components/button/WriteButton";
import { useNavigate } from "react-router";
import {postWorry} from "../api/api";
import Modal from "../components/modal/Modal";
import ConfirmModal from "../components/modal/ConfirmModal";


const WriteWorry = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    //Confirm모달 관련
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [ConfirmModalMessage, setConfirmModalMessage] = useState("");

    //모달 관련
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ModalMessage, setModalMessage] = useState("");

    const handleSubmit = async () => {
        if (!title || !content) {
            setConfirmModalMessage("제목과 내용을 입력해주세요!");
            setIsConfirmModalOpen(true);
            return;
        }

        try {
            await postWorry({ title, content });
            navigate("/boardworry");
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
        setIsModalOpen(false); // 취소 모달 닫기
        setIsConfirmModalOpen(false); // 취소 모달 닫기

    };

    return (
        <Container>
            <Title>고민글 쓰기</Title>
            <ContentsContainer>
                <InputLabel>제목</InputLabel>
                <TitleInput placeholder="제목을 입력하세요."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                />
                <InputLabel>내용</InputLabel>
                <ContentInput
                    placeholder="마음 속에 담아두었던 고민을 작성해주세요."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </ContentsContainer>
            <WriteButton
                text="작성 완료!"
                onClick={handleSubmit}
            />

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                message={ConfirmModalMessage}
                onConfirm={handleCancel}
            />

            <Modal
                isOpen={isModalOpen}
                message={ModalMessage}
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
    justify-content: center;
    flex-direction: column;
    padding: 0px;
    margin-top: 10px;
`;


const Title = styled.h1`
    color: white;
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: left;
    font-family: 'NeoDunggeunmo';
`;


const InputLabel = styled.label`
    font-size: 1.2rem;
    margin-bottom: 10px;
    display: block;
    font-family: 'NeoDunggeunmo';
`;

const TitleInput = styled.input`
    width: 100%;
    border: none;
    border-bottom: 2px solid #ccc;
    font-size: 1.2rem;
    margin-bottom: 20px;
    padding: 5px;
    outline: none;
    font-family: 'NeoDunggeunmo';
`;

const ContentInput = styled.textarea`
    width: 100%;
    border: none;
    border-bottom: 2px solid #ccc;
    font-size: 1rem;
    margin-bottom: 20px;
    padding: 5px;
    resize: none;
    outline: none;
    font-family: 'NeoDunggeunmo';
    height: 50vh;
    scrollbar-width: none; // 스크롤바 안보이게 하기

`;
