import React, { useState } from "react";
import styled from "styled-components";
import WriteButton from "../components/button/WriteButton";
import { useNavigate } from "react-router";
import { postDiary } from "../api/api";
import ContentTitle from "../components/write/ContentTitle";
import Content from "../components/write/Content";
import EmotionSelect from "../components/write/EmotionSelector";
import WhiteContentsArea from "../components/layout/WhiteContentsArea";
import {useModals} from "../context/ModalContext";

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
    const { openModal } = useModals();

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

    const handleSubmit = () => {
        if (!title || !content) {
            openModal({
                type: "alert",
                message: "제목과 내용을 입력해주세요!",
            });
            return;
        }

        openModal({
            type: "confirm",
            message: "정말로 작성하시겠습니까?",
            onConfirm: async () => {
                await submitDiary();
            },
        });
    };

    const submitDiary = async () => {
        const transformedEmotions = transformEmotionScores(emotionScores);

        const payload = {
            title,
            content,
            emotions: transformedEmotions,
        };

        try {
            const response = await postDiary(payload);

            if (response.isSuccess) {
                const diaryIdx = response.data.diaryIdx;

                openModal({
                    type: "alert",
                    message: "일기 작성이 완료되었습니다!",
                    onConfirm: () => navigate(`/diary/${diaryIdx}`),
                });
            } else {
                openModal({
                    type: "alert",
                    message: "일기 작성에 실패했습니다.",
                });
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const { error: serverError } = error.response.data;

                if (serverError && serverError.message) {
                    openModal({
                        type: "alert",
                        message: serverError.message || "일기 작성에 실패했습니다.",
                    });
                    return;
                }
            }

            openModal({
                type: "alert",
                message: "에러가 발생했습니다.",
            });
        }
    }

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


