/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    env: {
        NEXT_PUBLIC_KAKAO_MAP_API_KEY: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY,
        NEXT_PUBLIC_KAKAO_REST_API_KEY: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    },
    images: {
        domains: ['mk.kakaocdn.net', 'localhost', 'groovymap-s3-bucket.s3.ap-northeast-2.amazonaws.com'],
        loader: 'default',
        path: '/_next/image',
    },
    webpack: (config) => {
        if (isProd) {
            config.devtool = false; // 소스 맵 비활성화 (생산 환경)
        } else {
            config.devtool = 'source-map'; // 개발 환경에서는 source-map 사용
        }

        config.module.rules.push({
            test: /\.(mov|mp4)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    },
                },
            ],
        });

        return config;
    },
};

export default nextConfig;
