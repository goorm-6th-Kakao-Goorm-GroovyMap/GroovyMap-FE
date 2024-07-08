import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://842a-175-223-17-199.ngrok-free.app', // 백엔드 서버 주소
    withCredentials: true, // 쿠키를 포함하도록 설정
    headers: {
        //'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420', // ngrok에서 html로 데이터가 넘어올 때 사용하기
    },
});

export default apiClient;
