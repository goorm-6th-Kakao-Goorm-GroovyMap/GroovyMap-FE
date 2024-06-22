import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000', // 백엔드 서버 주소
    headers: {
        'Content-Type': 'application/json',
        // 'ngrok-skip-browser-warning': '69420',
    },
});

export default apiClient;
