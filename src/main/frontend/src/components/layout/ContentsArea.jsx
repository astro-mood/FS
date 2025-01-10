import styled from "styled-components";

const ContentsArea = styled.div`
    width: calc(100% - 200px); /* 좌우 여백 */
    max-width: 2000px; /* 최대 너비 설정 */
    height: calc(100vh - 200px); /* 상하 여백 */
    flex-shrink: 0;
    background: rgba(72, 49, 101, 0.7);    
    border-radius: 10px;
    overflow-y: auto; // 세로 스크롤바
    scrollbar-width: none; // 스크롤바 안보이게 하기

`;

export default ContentsArea;
