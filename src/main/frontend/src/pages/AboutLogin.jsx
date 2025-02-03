import React from "react";
import styled from "styled-components";
import AstroMoodGuide from "../components/intro/AstromoodGuide";

const AboutLogin = () => {
    return (
        <AboutContainer>
            <AstroMoodGuide/>
        </AboutContainer>
    );
};

export default AboutLogin;

const AboutContainer = styled.div`
    display: flex;
    justify-content: center; 
    align-items: flex-start;
    width: calc(100% - 250px);
    margin-left: 250px;
    overflow-y: auto;
    scrollbar-width: none;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }
`;
