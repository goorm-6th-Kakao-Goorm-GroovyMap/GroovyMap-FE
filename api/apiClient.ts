import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://53fc-39-7-53-19.ngrok-free.app ', // 백엔드 서버 주소
    withCredentials: true, // 쿠키를 포함하도록 설정
    headers: {
        //'Content-Type': 'application/json', <-설정이 필요한 부분에 따로 넣어주기
        'ngrok-skip-browser-warning': '69420', // ngrok에서 html로 데이터가 넘어올 때 사용하기
    },
});

export default apiClient;
