import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            colors: {
                white: '#FFFFFF',
                black: '#000000',
                kakao: '#FFEB00', // Kakao's brand color
            },
            stroke: {
                current: 'currentColor',
            },
            screens: {
                'xs': '390px', // Custom screen for 390px and below
            },
        },
    },
    plugins: [],
};
export default config;
