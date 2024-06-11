import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'https://19a1-1-241-95-127.ngrok-free.app',
})

export default apiClient
