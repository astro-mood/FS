import { createGlobalStyle } from 'styled-components';

// 전역 스타일 관리 컴퍼넌트
const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'PyeongChangPeace-Bold';
        src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2206-02@1.0/PyeongChangPeace-Bold.woff2') format('woff2');
        font-weight: 700;
        font-style: normal;
    }
    
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
