import React, { useState } from "react";
import styled from "styled-components";
import WriteButton from "../components/button/WriteButton";
import { useNavigate } from "react-router";
import { postDiary } from "../api/api";
import Modal from "../components/modal/Modal";
import ConfirmModal from "../components/modal/ConfirmModal";
import ContentTitle from "../components/write/ContentTitle";
import Content from "../components/write/Content";
import EmotionSelect from "../components/write/EmotionSelector";
import WhiteContentsArea from "../components/layout/WhiteContentsArea";

// 감정 이모지 -> emotionIdx 매핑
const EMOTION_MAP = {
    "😄기쁨": 1,
    "😚설렘": 2,
    "😌안도": 3,
    "🤖보통": 4,
    "😭슬픔": 5,
    "🥺불안": 6,
    "😡분노": 7,
};

// emotion, userScore 배열 형식 변경.emotions [ / ] 로 보낼 수 있게
const transformEmotionScores = (scores) => {
    return scores.map((item) => {
        return {
            emotionIdx: EMOTION_MAP[item.emotion] || 0,
            userScore: parseInt(item.score, 10) || 0,
        };
    });
};

const WriteDiary = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // emotion 초기값 설정
    const [emotionScores, setEmotionScores] = useState([{ emotion: "😄기쁨", score: "10" }]);

    // Confirm 모달 관련
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    // 모달 관련
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handleEmotionChange = (index, field, value) => {
        setEmotionScores(prev => {
            const newArr = [...prev];
            newArr[index] = { ...newArr[index], [field]: value };
            return newArr;
        });
    };

    const addEmotionScore = () => {
        setEmotionScores(prev => [...prev, { emotion: "", score: "" }]);
    };

    const removeEmotionScore = (index) => {
        setEmotionScores(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleSubmit = async () => {
        if (!title || !content) {
            setConfirmModalMessage("제목과 내용을 입력해주세요!");
            setIsConfirmModalOpen(true);
            return;
        }

        const transformedEmotions = transformEmotionScores(emotionScores);

        // payload 형식
        const payload = {
            title,
            content,
            emotions: transformedEmotions,
        };

        console.log("전송할 payload:", payload);

        try {
            // 보낼 값 payload로 설정
            await postDiary(payload);
            setModalMessage("작성이 완료되었습니다!");
            setIsModalOpen(true);
        } catch (error) {
            setConfirmModalMessage("데이터 전송에 실패했습니다. 다시 시도해주세요.");
            setIsConfirmModalOpen(true);
        }
    };

    const handleConfirm = () => {
        setIsConfirmModalOpen(false);
        navigate("/mydiary");
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsConfirmModalOpen(false);
    };

    return (
        <Container>
            <Title>오늘의 일기쓰기</Title>
            <WhiteContentsArea>

            <ContentsContainer>
                <ContentTitle
                    placeholder="제목을 입력해주세요."
                    title={title}
                    setTitle={setTitle} />
                <EmotionSelect
                    emotionScores={emotionScores}
                    handleEmotionChange={handleEmotionChange}
                    addEmotionScore={addEmotionScore}
                    removeEmotionScore={removeEmotionScore}
                />
                <Content
                    placeholder="오늘 있었던 일과 감정을 표현해주세요."
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
        </WhiteContentsArea>
        </Container>
    );
};

export default WriteDiary;

const Container = styled.div`
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin-top: -20px;
    overflow-y: auto;
`;

const ContentsContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    gap: 16px;
    //height: calc(100vh - 160px);
    overflow-y: auto;
    scrollbar-width: none; // 스크롤바 안보이게 하기
`;

const Title = styled.h1`
    color: white;
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: left;
    font-family: "NeoDunggeunmo";
`;


