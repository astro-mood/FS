import axios from 'axios';
import instance from './instance';

// 고민글 작성 API WriteWorry-postWorry
export const postWorry = async (data) => {
    try {
        const response = await instance.post("/writeworry", data);
        return response.data; // 성공적으로 전송된 데이터 반환
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error; // 에러를 호출한 곳에서 처리하도록 던짐
    }
};

// 모든 고민글 불러오기 API BoardWorry-GetAllWorries
export const getAllWorries = async () => {
    try {
        const response = await instance.get("/worry");
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 고민글 상세 페이지
export const getWorryByIdx = async (worry_idx) => {
    try {
        const response = await instance.get(`/worry/${worry_idx}`);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 고민글 삭제
export const deleteWorry = async (worry_idx) => {
    try {
        const response = await instance.delete(`/worry/${worry_idx}`);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 고민글 수정
export const updateWorry = async (worry_idx, updatedData) => {
    try {
        const response = await instance.put(`/worry/${worry_idx}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};
// 고민글 상태변경 로직
export const resolveChangeWorry = async (worry_idx, updatedData) => {
    try {
        const response = await instance.patch(`/worry/${worry_idx}/resolve`, updatedData);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
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

