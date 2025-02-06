import React from "react";
import styled from "styled-components";
import AstroMoodGuide from "../components/intro/AstromoodGuide";
import WriteButton from "../components/button/WriteButton";
import {useNavigate} from "react-router";
const AboutAll = () => {
    const navigate = useNavigate()

    return (
        <AboutContainer>
            <AstroMoodGuide/>
            <WriteButton
                text="메인으로 돌아가기"
                onClick={() => navigate("/")}
            />
        </AboutContainer>
    );
};

export default AboutAll;

const AboutContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100vh; 
    overflow-y: auto;
    scrollbar-width: none; 

    ::-webkit-scrollbar {
        display: none; 
    }
`;


