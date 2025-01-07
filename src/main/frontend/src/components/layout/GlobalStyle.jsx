import { createGlobalStyle } from 'styled-components';

// 전역 스타일 관리 컴퍼넌트
const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        background: #000000;
        color: white;
        display: flex;
    }

    #root {
        position: relative;
        width: 100%;
        height: 100vh;

    }
`;

export default GlobalStyle;
