import React from "react";
import styled from "styled-components";

const DateDropdown = ({ selectedDate, onDateChange }) => {
    //  한국시간 기준으로 하면 max가 적용이 안되어서 max 적용할 수 있도록 ISO로 변환
    const todayISOFormat = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date()).replace(/\. /g, '-').replace(/\./g, '');

    return (
        <DropdownContainer>
            <StyledDateInput
                type="date"
                id="datePicker"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                max={todayISOFormat}
            />
        </DropdownContainer>
    );
};

export default DateDropdown;

const DropdownContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;

    label {
        font-size: 1rem;
        color: white;
    }
`;

const StyledDateInput = styled.input`
    padding: 2px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-family: 'NeoDunggeunmo';
    color: #000;
    cursor: pointer;
    font-size: 1rem;

    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: white; 
    text-align: center;
`;