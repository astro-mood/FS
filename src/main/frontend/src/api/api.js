import axios from 'axios';
import instance from './instance';

// 고민글 작성 API WriteWorry-postWorry
export const postWorry = async (data) => {
    try {
        const response = await instance.post("/worry", data);
        return response.data; // 성공적으로 전송된 데이터 반환
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error; // 에러를 호출한 곳에서 처리하도록 던짐
    }
};


// 일기작성 API WriteDiary-postDiary
export const postDiary = async (data) => {
    try {
        const response = await instance.post("/writediary", data);
        return response.data; // 성공적으로 전송된 데이터 반환
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error; // 에러를 호출한 곳에서 처리하도록 던짐
    }
};

