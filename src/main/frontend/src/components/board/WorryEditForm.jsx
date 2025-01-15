import React from "react";
import styled from "styled-components";
import SmallButton from "../button/SmallButton";
import ContentTitle from "../write/ContentTitle";
import Content from "../write/Content";

const WorryEditForm = ({
                           editedWorry,
                           handleEditChange,
                           handleEditSave,
                           handleEditToggle,
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
                title={editedWorry.title}
                setTitle={handleTitleChange}
                placeholder="제목을 입력해주세요."
            />
            <Content
                content={editedWorry.content}
                setContent={handleContentChange}
                placeholder="마음에 담아두었던 고민을 작성해주세요."
            />
            <EditActions>
                <SmallButton onClick={handleEditSave}>저장하기</SmallButton>
                <SmallButton onClick={handleEditToggle}>취소하기</SmallButton>
            </EditActions>
        </EditForm>
    );
};

export default WorryEditForm;

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
