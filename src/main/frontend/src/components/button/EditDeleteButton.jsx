import React from "react";
import styled from "styled-components";
import SmallButton from "./SmallButton";

const OwnerActions = ({
                          handleEditToggle,
                          handleDelete,
                      }) => {
    return (
        <FlexRow>
            <SmallButton onClick={handleEditToggle}>수정하기</SmallButton>
            <SmallButton onClick={handleDelete}>삭제하기</SmallButton>
        </FlexRow>
    );
};

export default OwnerActions;

const FlexRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    margin-top: -10px;
`;
