import { css } from 'styled-components';

// 미디어 쿼리 헬퍼 함수
const MediaQuery = {
    mobile: (...args) => css`
        @media only screen and (max-width: 1200px) {
            ${css(...args)}
        }
    `,
    tablet: (...args) => css`
        @media only screen and (max-width: 768px) {
            ${css(...args)}
        }
    `,
    desktop: (...args) => css`
        @media only screen and (min-width: 1201px) {
            ${css(...args)}
        }
    `,
};

export default MediaQuery;