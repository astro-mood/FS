import React from "react";
import AboutImage from "../images/about.png";
import styled from "styled-components";

const AboutLogin = () => {
    return (
        <AboutContainer>
            <ImageWrapper>
                <img src={AboutImage} alt="About ASTRO MOOD" />
            </ImageWrapper>
        </AboutContainer>
    );
};

export default AboutLogin;

const AboutContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 180px;
`;

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center; 
    align-items: center; 

    img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain; // 이미지 비율 유지하며 크기 조정
    }
`;