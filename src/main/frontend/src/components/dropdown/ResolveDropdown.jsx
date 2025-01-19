import React from "react";
import styled from "styled-components";

const ResolveDropdown = ({ isResolved, onChange }) => (
    <Dropdown onChange={onChange} defaultValue={isResolved ? "해결 완료" : "진행 중"}>
        <option value="진행 중">고민 진행 중</option>
        <option value="해결 완료">고민 해결 완료</option>
    </Dropdown>
);

export default ResolveDropdown;

const Dropdown = styled.select`
    padding: 5px 30px 5px 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-family: 'NeoDunggeunmo';
    color: #000;

    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='purple' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 5px center;
    background-size: 12px 8px;
`;
