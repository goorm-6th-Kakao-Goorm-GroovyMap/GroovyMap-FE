'use client';

import React, { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import KakaoImg from './SocialLoginLogo/Kakao'; // default import
import Drawing from '@/components/Svg/Drawing';
import GoogleImg from './SocialLoginLogo/Google';
import apiClient from '@/api/apiClient';
import { useMutation } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';
import confetti from 'canvas-confetti';
import { userState } from '@/recoil/state/loginState';
import { toast } from 'react-toastify';

const Login = () => {
    const router = useRouter();
    const [user, setUser] = useRecoilState(userState);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const loginMutation = useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            const response = await apiClient.post('/login', data);
            return response.data;
        },
        onSuccess: (data) => {
            setUser(data.user); //리코일에서 가져온 유저 정보 넘겨주고 메인으로 이동
            toast.success('로그인에 성공했습니다!');
            confetti({
                particleCount: 100,
                spread: 160,
            });
            router.push('/');
        },
        onError: (error) => {
            console.log('Error during login:', error);
            toast.error('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.');
        },
    });

    const handleEmailLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        loginMutation.mutate(formData);
    };

    //소셜 로그인 나중에 추가하기
    const handleKakaoLogin = () => {
        const kakaoLoginURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/kakao`;
        router.push(kakaoLoginURL);
    };

    const handleGoogleLogin = () => {
        const googleLoginURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/google`;
        router.push(googleLoginURL);
    };

    return (
        <>
            <title>그루비 맵 | 로그인</title>
            <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50">
                <div className="mb-2">
                    <Drawing />
                </div>
                <form
                    className="flex flex-col gap-4 w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
                    onSubmit={handleEmailLogin}
                >
                    <input
                        type="email"
                        name="email"
                        placeholder="이메일"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                    <div className="flex justify-between mt-6">
                        <Link href="/signup" className="w-1/2 pr-2">
                            <button className="w-full bg-purple-500 text-white hover:bg-purple-600 py-3 rounded-lg transition transform duration-300 hover:scale-105">
                                회원가입
                            </button>
                        </Link>
                        <button
                            type="submit"
                            className="w-1/2 bg-purple-500 text-white hover:bg-purple-600 py-3 ml-2 rounded-lg transition transform duration-300 hover:scale-105"
                        >
                            로그인
                        </button>
                    </div>
                </form>
                <div className="flex flex-col gap-4 mt-8 w-full max-w-md">
                    <button
                        className="relative flex items-center justify-center w-full bg-kakao font-semibold text-black shadow-sm dark:shadow-slate-500 py-3 rounded-lg transition transform duration-300 hover:scale-105"
                        onClick={handleKakaoLogin}
                    >
                        <div className="absolute left-6 top-2">
                            <KakaoImg />
                        </div>
                        <span className="ml-8">카카오로 로그인하기</span>
                    </button>
                    <button
                        className="relative flex items-center justify-center w-full border border-gray-400 bg-white font-semibold text-black shadow-sm dark:shadow-slate-500 py-3 rounded-lg transition transform duration-300 hover:scale-105"
                        onClick={handleGoogleLogin}
                    >
                        <div className="absolute left-6 top-2">
                            <GoogleImg />
                        </div>
                        <span className="ml-8">구글로 계속하기</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Login;
