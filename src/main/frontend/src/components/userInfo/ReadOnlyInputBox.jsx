import React from "react";
import styled from "styled-components";
import MediaQuery from "../layout/MediaQuery";

const ReadOnlyInputBox = React.memo(({ label, name, value}) => {
    return (
        <InputDiv>
            <Label>{label}</Label>
            <Input type="text" name={name} value={value} readOnly={true} />
        </InputDiv>
    );
});

export default ReadOnlyInputBox;

const InputDiv = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    width: 35rem;

    ${MediaQuery.mobile`
        flex-direction: column;
        gap: 0.3125rem;
        width: 100%;
    `}
`;
const Label = styled.label`
    color: #7D8DDE;
    width: 12.5rem;
    font-size: 1.25rem;
    font-weight: bold;
    line-height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const Input = styled.input`
    background-color: rgba(125, 141, 222, 0.43);
    color: white;
    display: block;
    width: 100%;
    max-width: 22.5rem;
    padding: 0.625rem 1rem;
    border-radius: 3.125rem;
    box-sizing: border-box;
    border: none;
    outline: none;
    font-family: inherit;
    font-size: 1rem;
    &[readonly] {
        background-color: unset;
    }
`;