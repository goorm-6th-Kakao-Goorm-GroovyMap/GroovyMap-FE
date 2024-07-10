import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: 60000,
    withCredentials: true,
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
    (config) => {
        // 데이터 타입에 따라 Content-Type 설정
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        } else {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
