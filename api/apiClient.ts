import axios from 'axios';

const apiClient = axios.create({
    //baseURL: 'https://40f4-180-66-235-215.ngrok-free.app', // 환경 변수로 설정된 베이스 URL
    baseURL: 'http://localhost:3000', // 백엔드 서버 주소 8080으로 테스트 후에 변경

    headers: {
        'Content-Type': `application/json`,
        // 'ngrok-skip-browser-warning': '69420',
    },
});

export default apiClient;
