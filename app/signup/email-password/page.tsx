'use client';

import React, { ChangeEvent, useState } from 'react';
import { useRecoilState } from 'recoil';
import { signUpState } from '@/recoil/state/signupState';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';

const EmailPasswordPage: React.FC = () => {
    const [formData, setFormData] = useRecoilState(signUpState);
    const [certificationCode, setCertificationCode] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const router = useRouter();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    //인증 코드 확인
    const handleCertificationCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCertificationCode(e.target.value);
    };

    //이메일 인증 코드 보내기
    const sendEmailCodeMutation = useMutation({
        mutationFn: async () => {
            const response = await apiClient.post('/register/send-certification', { email: formData.email });
            return response.data;
        },
        onSuccess: (data) => {
            const message = data.message || '인증 코드가 이메일로 전송되었습니다.'; // 기본 메시지 설정
            toast.success(message); // 이메일 전송 성공 메시지 표시
        },
        onError: (error) => {
            toast.error('이메일 인증 요청에 실패했습니다.');
        },
    });

    //인증 코드 확인
    const validateEmailCodeMutation = useMutation({
        mutationFn: async () => {
            const response = await apiClient.post('/register/certificate-code', {
                email: formData.email,
                certificationCode: certificationCode,
                //이메일과 인증 코드를 보냄
            });
            return response.data; //json data 반환(result, message)
        },
        onSuccess: (data) => {
            const result = data.result !== undefined ? data.result : false; // 기본 값 설정
            const message = data.message || (result ? '이메일 인증에 성공했습니다!' : '인증 코드가 잘못되었습니다.');
            //result 값 확인 후, 반환 값에 message 있으면 넣고, 아니면 result가 true일때 성공 메시지.
            if (result) {
                //reult값이 true일 경우
                toast.success(message);
                setFormData((prev) => ({ ...prev, certificationCode }));
                setIsEmailVerified(true);
            } else {
                toast.error(message);
            }
        },
        onError: () => {
            toast.error('인증에 실패했습니다.');
        },
    });

    const handleSendEmailCode = () => {
        if (!formData.email) {
            toast.warning('이메일을 입력해 주세요.');
            return;
        }
        sendEmailCodeMutation.mutate();
    };

    const handleValidateEmailCode = () => {
        if (!formData.email) {
            toast.warning('이메일을 입력해 주세요.');
            return;
        }
        if (!certificationCode) {
            toast.warning('인증 코드를 입력해 주세요.');
            return;
        }
        validateEmailCodeMutation.mutate(); //인증코드 보냄
    };

    //비밀 번호 확인
    const isPasswordSame = formData.password === confirmPassword;

    //다음 닉네임 및 지역 분야 설정 페이지로 이동
    const handleNext = () => {
        if (!formData.email) {
            toast.warning('이메일을 입력해 주세요.');
            return;
        }
        if (!certificationCode) {
            toast.warning('인증 코드를 입력해 주세요.');
            return;
        }
        if (!isPasswordSame) {
            toast.warning('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (isEmailVerified) {
            router.push('/signup/nickname-region-part');
        } else {
            toast.warning('이메일 인증을 완료해 주세요.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">회원가입 - 이메일 인증</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-2">이메일</label>
                        <div className="flex">
                            <input
                                type="email"
                                name="email"
                                placeholder="이메일을 입력하세요"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="flex-1 p-3 border rounded-l-lg"
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
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">인증 코드</label>
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="인증 코드를 입력하세요"
                                value={certificationCode}
                                onChange={handleCertificationCodeChange}
                                className="flex-1 p-3 border rounded-l-lg"
                                required
                            />
                            <button
                                type="button"
                                onClick={handleValidateEmailCode} //받은 인증 코드 post
                                className="w-32 bg-purple-500 text-white hover:bg-purple-600 rounded-r-lg transition transform duration-300 hover:scale-105"
                            >
                                인증 코드 확인
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호를 입력하세요"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">비밀번호 확인</label>
                        <input
                            type="password"
                            placeholder="비밀번호를 한번 더 입력해주세요."
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg"
                            required
                        />
                        {!isPasswordSame && <div className="text-sm text-red-500">비밀번호가 일치하지 않습니다.</div>}
                    </div>
                    <button
                        className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition"
                        onClick={handleNext}
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailPasswordPage;
