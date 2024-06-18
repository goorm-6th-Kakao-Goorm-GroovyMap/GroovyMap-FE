/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_KAKAO_MAP_API_KEY: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY,
        NEXT_PUBLIC_KAKAO_REST_API_KEY: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
    },
    images: {
        domains: ['localhost', 'mk.kakaocdn.net'], // 'localhost:8080'을 'localhost'로 수정
        loader: 'default',
        path: '/_next/image',
    },
};

export default nextConfig;
