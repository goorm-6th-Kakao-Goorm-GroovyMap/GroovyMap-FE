/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_KAKAO_MAP_API_KEY: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY,
        NEXT_PUBLIC_KAKAO_REST_API_KEY: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
    },
    images: {
        domains: ['localhost', 'mk.kakaocdn.net', 'd4f0-180-66-235-215.ngrok-free.app'], // 'localhost:8080'을 'localhost'로 수정
        loader: 'default',
        path: '/_next/image',
    },
};

export default nextConfig;
