import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080',

    headers: {
        'Content-Type': `application/json`,
        // 'ngrok-skip-browser-warning': '69420',
    },
});

export default apiClient;
