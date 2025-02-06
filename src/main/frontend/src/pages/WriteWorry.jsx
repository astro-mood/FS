import React, { useState } from "react";
import styled from "styled-components";
import WriteButton from "../components/button/WriteButton";
import { useNavigate } from "react-router";
import { postWorry } from "../api/api";
import ContentTitle from "../components/write/ContentTitle";
import Content from "../components/write/Content";
import WhiteContentsArea from "../components/layout/WhiteContentsArea";
import { useModals } from "../context/ModalContext";


const WriteWorry = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const { openModal } = useModals();

    const handleSubmit = async () => {
        if (!title || !content) {
            openModal({
                type: "alert",
                message: "제목과 내용을 입력해주세요!",
            });
            return;
        }

        openModal({
            type: "confirm",
            message: "정말로 고민을 작성하시겠습니까?",
            onConfirm: async () => {
                try {
                    const response = await postWorry({ title, content });

                    if (response.isSuccess) {
                        const worryIdx = response.data.worryIdx; // 새로 작성된 고민의 ID 가져오기

                        openModal({
                            type: "alert",
                            message: "고민 작성이 완료되었습니다!",
                            onConfirm: () => navigate(`/worry/${worryIdx}`),
                        });
                    } else {
                        openModal({
                            type: "alert",
                            message: "고민 작성에 실패했습니다.",
                        });
                    }
                } catch (error) {
                    if (error.response && error.response.data) {
                        const { error: serverError } = error.response.data;

                        if (serverError && serverError.message) {
                            openModal({
                                type: "alert",
                                message: serverError.message || "고민 작성에 실패했습니다.",
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
        });
    };


    return (
        <Container>
            <Title>고민글 쓰기</Title>
            <WhiteContentsArea>
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
            </WhiteContentsArea>
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
    height: calc(100vh - 160px);
`;

const Title = styled.h1`
    color: white;
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: left;
    font-family: "NeoDunggeunmo";
`;