/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost:8080', 'mk.kakaocdn.net'],
        loader: 'default',
        path: '/',
    },
}
//도메인에 허용 url추가하기
export default nextConfig
