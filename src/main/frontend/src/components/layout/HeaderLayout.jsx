import React from "react";
import Header from "./Header";
import {Outlet} from "react-router-dom";
import styled from "styled-components";


const HeaderLayout = () => {
    return (
        <LayoutContainer>
                <Header />
            <ContentWrapper>
                <Outlet />
            </ContentWrapper>
        </LayoutContainer>
    );
};

export default HeaderLayout;

const LayoutContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100vh; 
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow-y: auto; // 콘텐츠가 크면 스크롤 가능
`;

