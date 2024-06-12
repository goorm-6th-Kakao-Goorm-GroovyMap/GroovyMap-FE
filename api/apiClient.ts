import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://d086-14-63-67-22.ngrok-free.app',

    headers: {
        // 'ngrok-skip-browser-warning': '69420',
    },
});

export default apiClient;
