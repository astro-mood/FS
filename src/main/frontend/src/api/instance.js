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
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 추가
instance.interceptors.response.use(
    function (response) {
        // 2xx 범위에 있는 상태 코드는 이 함수를 트리거
        // 응답 데이터가 있는 작업 수행
        let bearer_token = response.headers['bearer_token'];
        if(bearer_token){
            const token = localStorage.getItem('token');
            if(token !== bearer_token){
                localStorage.setItem("token", bearer_token); // 토큰 저장
            }
        }
        return response;
    },
    function (error) {
        // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거
        // 응답 오류가 있는 작업 수행
        if (error.response && error.response.status) {
            switch (error.response.status) {
                // status code가 401인 경우 `logout`을 커밋하고 `/login` 페이지로 리다이렉트
                case 401:
                    alert('세션이 만료되었습니다. 다시 로그인해 주시기 바랍니다.');
                    window.location.href = `/`;

                    break;
                default:
                    return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    },
);

export default instance;