import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    // timeout: 600000,
    // withCredentials: true, // 모든 요청에 쿠키를 포함
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
    },
});

export default apiClient;
