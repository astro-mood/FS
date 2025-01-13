import styled from "styled-components";

const WhiteContentsArea = styled.div`
    height: calc(100vh - 180px);
    overflow-y: auto;
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    scrollbar-width: none; // 스크롤바 안보이기\
    // 자식 요소들이 세로로 쌓이도록
    display: flex;
    flex-direction: column;
`;

export default WhiteContentsArea;
