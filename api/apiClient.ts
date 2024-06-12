import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'https://localhost:8080',
})

export default apiClient
