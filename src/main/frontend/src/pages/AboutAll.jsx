import React from "react";
import AboutImage from "../images/about.png";
import styled from "styled-components";

const AboutAll = () => {
    return (
        <AboutContainer>
            <img src={AboutImage} alt="About ASTRO MOOD" />
        </AboutContainer>
    );
};

export default AboutAll;

const AboutContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%; 
`;


