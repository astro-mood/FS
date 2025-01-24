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
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 달력에 일기 가져오기 API
export const getMyDiary = async (data) => {
    try {
        const response = await instance.get("/mydiary", {
            params: data,
        });
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

//일기 상세보기 API
export const getDiaryByIdx = async (diary_idx) => {
    try {
        const response = await instance.get(`/diary/${diary_idx}`);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 일기 삭제
export const deleteDiary = async (diary_idx) => {
    try {
        const response = await instance.delete(`/diary/${diary_idx}`);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 일기 수정
export const updateDiary = async (diary_idx, updatedData) => {
    try {
        const response = await instance.put(`/diary/${diary_idx}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 고민 댓글 작성
export const postWorryComment = async (worry_idx, data) => {
    try {
        const response = await instance.post(`/worry-comments/${worry_idx}`, data);
              return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 고민 댓글 불러오기
export const getWorryComment = async (worry_idx) => {
    try {
        const response = await instance.get(`/worry-comments/${worry_idx}`);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 고민 댓글 삭제
export const deleteWorryComment = async (worry_comment_idx) => {
    try {
        const response = await instance.delete(`/worry-comments/${worry_comment_idx}`);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 고민 댓글 수정
export const updateWorryComment = async (worry_comment_idx, updatedData) => {
    try {
        const response = await instance.put(`/worry-comments/${worry_comment_idx}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 고민 댓글 신고
export const reportWorryComment = async (worry_comment_idx) => {
    try {
        const response = await instance.patch(`/worry-comments/${worry_comment_idx}`);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 일기 댓글 작성
export const postDiaryComment = async (diary_idx, data) => {
    try {
        const response = await instance.post(`/diary-comments/${diary_idx}`, data);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 일기 댓글 불러오기
export const getDiaryComment = async (diary_idx) => {
    try {
        const response = await instance.get(`/diary-comments/${diary_idx}`);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 일기 댓글 삭제
export const deleteDiaryComment = async (diary_comment_idx) => {
    try {
        const response = await instance.delete(`/diary-comments/${diary_comment_idx}`);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 일기 댓글 수정
export const updateDiaryComment = async (diary_comment_idx, updatedData) => {
    try {
        const response = await instance.put(`/diary-comments/${diary_comment_idx}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};

// 댓글 좋아요
export const commentLike = async (commentIdx) => {
    try {
        const response = await instance.post(`/likes/${commentIdx}`);
        return response.data;
    } catch (error) {
        console.error("좋아요 API 요청 에러:", error);
        throw error;
    }
};

// 유저정보 보기
export const getUserInfo = async (loginIdx) => {
    try {
        const response = await instance.get(`/user/${loginIdx}`);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};
      
//유저정보 수정은 ModifyUser.jsx

// 회원탈퇴
export const withdrawUser = async (loginIdx) => {
    try {
        const response = await instance.delete(`/user/${loginIdx}`);
        return response.data;
    } catch (error) {
        console.error("API 요청 에러:", error);
        throw error;
    }
};