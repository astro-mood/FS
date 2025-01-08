import React from "react";
import styled from "styled-components";
import Header from "./Header";
import ContentsArea from "./ContentsArea";
import { Outlet } from "react-router-dom";


const Layout = () => {
    return (
        <>
            <MainContainer>
                <Header />
                <ContentsWrapper>
                    <ContentsArea>
                    <Outlet />
                    </ContentsArea>
                </ContentsWrapper>
            </MainContainer>
        </>
    );
};

export default Layout;

// Header와 Contents를 나란히 배치
const MainContainer = styled.div`
    display: flex; 
    flex-direction: row;
    width: 100%;
    height: 100vh;
`;

const ContentsWrapper = styled.div`
    flex: 1; // header 제외 공간 채우기
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
