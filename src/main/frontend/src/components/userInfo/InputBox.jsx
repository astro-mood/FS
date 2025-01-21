import React from "react";
import styled from "styled-components";
import MediaQuery from "../layout/MediaQuery";

const InputBox = React.memo(({ label, name, value, onChange, isValid, message}) => {
    return (
        <InputDiv>
            <Label>{label}</Label>
            <InnerDiv>
                <Input type="text" name={name} value={value} onChange={onChange} autoComplete="off"/>
                <Message>{ isValid ? "" : message }</Message>
            </InnerDiv>
        </InputDiv>
    );
});

export default InputBox;

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
const InnerDiv = styled.div`
    width: 100%;
    max-width: 22.5rem;
    position: relative;
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
        background-color: rgba(125, 141, 222, 0.2);
    }
`;
const Message = styled.p`
    font-size: 0.75rem;
    color: #f06569;
    margin-top: 0.3125rem;
    width:100%;
    text-align: center;
    position: absolute;
`;