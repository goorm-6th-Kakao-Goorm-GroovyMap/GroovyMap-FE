import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://f39b-125-181-131-182.ngrok-free.app',

    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
    },
});

export default apiClient;
