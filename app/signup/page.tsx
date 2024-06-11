'use client';

import React, { useMemo, useState, ChangeEvent } from 'react';
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useMutation, UseMutationOptions, useQuery } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';

// 타입 설정
interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    nickname: string;
    certificationCode: string;
}

// API 응답 타입 정의
type ApiResponse<T> = {
    result: boolean;
    message?: string;
    data?: T;
};

export interface CertificationData {
    email: string;
    certificationCode?: string;
}

// 이메일 유효성 검사 함수
const validateEmailFormat = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

// 닉네임 유효성 검사 함수
const validateNickname = (nickname: string): boolean => {
    const re = /^[a-zA-Z0-9가-힣]{2,13}$/;
    return re.test(nickname);
};

// 비밀번호 유효성 검사 함수
const validatePassword = (password: string): boolean => {
    const re = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*\W).{8,16}$/;
    return re.test(password);
};

const Signup = () => {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        certificationCode: '',
    });
    const [availability, setAvailability] = useState({
        emailVerified: false,
    });
    const router = useRouter();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    //이메일 유효성 확인
    const isEmailValid = useMemo(() => {
        if (!formData.email) return true;
        return validateEmailFormat(formData.email);
    }, [formData.email]);

    //닉네임 유효성 확인
    const isNicknameValid = useMemo(() => {
        if (!formData.nickname) return true;
        return validateNickname(formData.nickname);
    }, [formData.nickname]);

    //비밀번호 유효성 검사
    const isPasswordValid = useMemo(() => {
        if (!formData.password) return true;
        return validatePassword(formData.password);
    }, [formData.password]);

    //비밀번호 한번 더 입력시 맞는지 확인
    const isPasswordSame = useMemo(() => {
        if (!formData.confirmPassword) return true;
        return formData.password === formData.confirmPassword;
    }, [formData.password, formData.confirmPassword]);

    //회원가입
    const canSignUp = useMemo(() => {
        return isNicknameValid && isPasswordValid && isPasswordSame && formData.certificationCode;
    }, [isNicknameValid, isPasswordValid, isPasswordSame, formData.certificationCode]);

    //토스트 창
    const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
        toast(message, { type });
    };

    const sendEmailCodeMutation = useMutation({
        mutationFn: async () => {
            const response = await apiClient.post('/register/send-certification', { email: formData.email });
            return response.data;
        },
        onSuccess: (data: ApiResponse<null>) => {
            if (data.message) {
                showToast(data.message, 'success');
            }
        },
        onError: (error: any) => {
            if (axios.isAxiosError(error) && error.response) {
                const errorResponse = error.response.data;
                if (errorResponse.status === 4003) {
                    showToast('이미 가입된 유저 이메일입니다. 다른 이메일을 사용해주세요.', 'error');
                } else {
                    showToast('이메일 인증 요청에 실패했습니다.', 'error');
                }
            } else {
                showToast('이메일 인증 요청에 실패했습니다.', 'error');
            }
        },
    });

    const validateEmailMutation = useMutation({
        mutationFn: async () => {
            const response = await apiClient.post<ApiResponse<CertificationData>>('/register/certificate-code', {
                email: formData.email,
                certificationCode: formData.certificationCode,
            });
            return response.data;
        },
        onSuccess: (data: ApiResponse<CertificationData>) => {
            if (data.result) {
                showToast('이메일 인증에 성공했습니다!', 'success');
                setAvailability((prev) => ({ ...prev, emailVerified: true }));
            } else {
                showToast(data.message || '인증 코드가 잘못되었습니다.', 'error');
            }
        },
        onError: (error: any) => {
            console.error('인증 실패:', error);
            showToast('인증에 실패했습니다.', 'error');
        },
    });

    const checkNicknameMutation = useMutation({
        mutationFn: async () => {
            const response = await apiClient.post<ApiResponse<null>>('/register/nickname-check', {
                nickname: formData.nickname,
            });
            return response.data;
        },
        onSuccess: (data: ApiResponse<null>) => {
            showToast(data.message || '사용 가능한 닉네임입니다.', 'success');
        },
        onError: (error: any) => {
            showToast('이미 사용 중인 닉네임입니다.', 'error');
        },
    });

    const signupMutation = useMutation({
        mutationFn: async () => {
            const response = await apiClient.post<ApiResponse<null>>('/register', {
                email: formData.email,
                password: formData.password,
                nickname: formData.nickname,
            });
            return response.data;
        },
        onSuccess: (data: ApiResponse<null>) => {
            if (data.result) {
                showToast('회원가입에 성공했습니다!', 'success');
                confetti({
                    particleCount: 100,
                    spread: 160,
                });
                setTimeout(() => {
                    router.push('/login');
                }, 2000); // 2초 후에 페이지 이동
            } else {
                showToast(data.message || '회원가입에 실패했습니다.', 'error');
            }
        },
        onError: (error: any) => {
            console.error('회원가입 실패:', error);
            showToast('알 수 없는 오류가 발생했습니다.', 'error');
        },
    });

    const handleSendEmailCode = () => {
        if (!formData.email) {
            showToast('이메일을 입력해 주세요.', 'warning');
            return;
        }
        sendEmailCodeMutation.mutate();
    };

    const handleValidateEmailCode = () => {
        if (!formData.email) {
            showToast('이메일을 입력해 주세요.', 'warning');
            return;
        }
        if (!formData.certificationCode) {
            showToast('인증 코드를 입력해 주세요.', 'warning');
            return;
        }
        validateEmailMutation.mutate();
    };

    const handleCheckNickname = () => {
        if (!formData.nickname) {
            showToast('닉네임을 입력해 주세요.', 'warning');
            return;
        }
        checkNicknameMutation.mutate();
    };

    const handleSignup = () => {
        if (!canSignUp) {
            showToast('입력 정보를 확인해주세요.', 'warning');
            return;
        }
        signupMutation.mutate();
    };

    return (
        <>
            <title>그루비 맵 | 회원가입</title>
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50">
                <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="block font-semibold">이메일</label>
                            <div className="flex">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="이메일을 입력하세요"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleSendEmailCode}
                                    className="w-32 bg-purple-500 text-white hover:bg-purple-600 rounded-r-lg transition transform duration-300 hover:scale-105"
                                >
                                    인증번호 보내기
                                </button>
                            </div>
                            <div className="mt-1 flex">
                                <input
                                    type="text"
                                    name="certificationCode"
                                    placeholder="인증번호를 입력하세요"
                                    value={formData.certificationCode}
                                    onChange={handleInputChange}
                                    className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleValidateEmailCode}
                                    className="w-32 bg-purple-500 text-white hover:bg-purple-600 rounded-r-lg transition transform duration-300 hover:scale-105"
                                >
                                    인증번호 확인
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block font-semibold">닉네임</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    name="nickname"
                                    placeholder="닉네임을 입력하세요"
                                    value={formData.nickname}
                                    onChange={handleInputChange}
                                    className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleCheckNickname}
                                    className="w-32 bg-purple-500 text-white hover:bg-purple-600 rounded-r-lg transition transform duration-300 hover:scale-105"
                                >
                                    중복 확인
                                </button>
                            </div>
                        </div>
                        <div className="my-2 h-3 text-sm text-red-500">
                            {!isNicknameValid && '닉네임은 특수 문자 제외 2자 이상 13자 이하이어야 합니다.'}
                        </div>
                        <div className="space-y-2">
                            <label className="block font-semibold">비밀번호</label>
                            <div className="flex">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="비밀번호를 입력하세요"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div className="mt-2 flex">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="비밀번호를 한번 더 입력해주세요."
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="my-3 h-3 text-sm text-red-500">
                            {!isPasswordSame && '비밀번호가 일치하지 않습니다.'}
                        </div>
                        <button
                            className={`w-full my-0 bg-purple-500 text-white py-3 rounded-lg transition transform duration-300 ${
                                canSignUp ? 'hover:bg-purple-600 hover:scale-105' : 'bg-gray-300 cursor-not-allowed'
                            }`}
                            onClick={handleSignup}
                            disabled={!canSignUp}
                        >
                            회원가입
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
