import axios from 'axios';

// const baseURL = process.env.REACT_APP_API_BASE_URL;
const instance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


// 인증 토큰 관리, 토큰 확인 후 수정
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;