import React from "react";
import styled from "styled-components";
import SmallButton from "../button/SmallButton";
import ContentTitle from "../write/ContentTitle";
import Content from "../write/Content";
import EditEmotionSelector from "../write/EditEmotionSelector";

const DiaryEditForm = ({
                           editedDiary,
                           handleEditChange,
                           handleEditSave,
                           handleEditToggle,
                           handleEmotionChange,
                           addEmotionScore,
                           removeEmotionScore,
                       }) => {

    const handleTitleChange = (newTitle) => {
        handleEditChange({ target: { name: "title", value: newTitle } });
    };


    const handleContentChange = (newContent) => {
        handleEditChange({ target: { name: "content", value: newContent } });
    };

    return (
        <EditForm>
            <ContentTitle
                title={editedDiary.title}
                setTitle={handleTitleChange}
                placeholder="제목을 입력해주세요."
            />
            <EditEmotionSelector
                emotionScores={editedDiary.emotions}
                handleEmotionChange={handleEmotionChange}
                addEmotionScore={addEmotionScore}
                removeEmotionScore={removeEmotionScore}
            />
            <Content
                content={editedDiary.content}
                setContent={handleContentChange}
                placeholder="오늘 있었던 일과 감정을 표현해주세요."
            />
            <EditActions>
                <SmallButton onClick={handleEditSave}>저장하기</SmallButton>
                <SmallButton onClick={handleEditToggle}>취소하기</SmallButton>
            </EditActions>
        </EditForm>
    );
};

export default DiaryEditForm;

const EditForm = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const EditActions = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    margin-top: -20px;
`;
