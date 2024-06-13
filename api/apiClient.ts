import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://64f3-125-181-131-182.ngrok-free.app',

    headers: {
        'ngrok-skip-browser-warning': '69420',
    },
});

export default apiClient;
