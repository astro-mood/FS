import React from "react";
import styled from "styled-components";
import AstroMoodGuide from "../components/intro/AstromoodGuide";

const AboutAll = () => {
    return (
        <AboutContainer>
            <AstroMoodGuide/>
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


