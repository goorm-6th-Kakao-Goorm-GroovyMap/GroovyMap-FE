import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://c24c-180-66-235-215.ngrok-free.app', // 백엔드 서버 주소
    withCredentials: true, // 모든 요청에 쿠키를 포함
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
    },
});

export default apiClient;
