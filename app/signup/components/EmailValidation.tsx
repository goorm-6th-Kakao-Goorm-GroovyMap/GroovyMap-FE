'use client';
import React, { useMemo, useState } from 'react';
import {
    Button,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from '@nextui-org/react';
import axios from 'axios';
import { IoChevronBackSharp } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { useMutation, UseMutationOptions, useQuery } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';

//타입 설정
interface EmailValidateProps {
    onEmailValidate: (email: string) => void;
}

// 이메일 유효성 검사 함수
const validateEmailFormat = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

//이메일 인증 api 요청 get 함수
const validateEmail = async (data: { email: string; code: string }): Promise<any> => {
    const response = await apiClient.get('/mail-check', { params: data });
    return response.data;
};

//이메일 인증 코드 확인 post
const sendEmailCode = async (email: string): Promise<any> => {
    const response = await apiClient.post('/send-mail', { email });
    return response.data;
};

const EmailValidation: React.FC<EmailValidateProps> = ({ onEmailValidate }) => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [sendCode, setSendCode] = useState(false);
    const [msg, setMsg] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();

    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            handleGoBack();
        }
    };

    //이메일 인증시 이메일로 인증 요청 보내기
    const sendEmailCodeMutation = useMutation({
        mutationFn: async (email: string) => {
            const response = await apiClient.post('/send-mail', { email });
            return response.data;
        },
        onSuccess: () => {
            setMsg('이메일 인증 요청을 보냈습니다. 인증코드를 입력해 주세요.');
            onOpen();
        },
        onError: (error: any) => {
            if (axios.isAxiosError(error) && error.response) {
                const errorResponse = error.response.data;
                if (errorResponse.status === 4003) {
                    setMsg('이미 가입된 유저 이메일입니다. 다른 이메일을 사용해주세요.');
                } else {
                    setMsg('이메일 인증 요청에 실패했습니다.');
                }
            }
            onOpen();
        },
    });

    //이메일 인증 성공/실패 확인 요청 보내기
    const validateEmailQuery = useQuery({
        queryKey: ['validateEmail', email, code],
        queryFn: async () => {
            const response = await apiClient.get(`/mail-check`, {
                params: { email, code },
            });
            return response.data;
        },
        enabled: false,
        onSuccess: () => {
            setMsg('이메일 인증에 성공했습니다!');
            onOpen();
            onEmailValidate(email);
        },
        onError: (error: any) => {
            setMsg('이메일 인증에 실패했습니다.');
            onOpen();
        },
    });

    //이메일 확인
    const isEmailValid = useMemo(() => {
        if (!email) return true;
        return validateEmailFormat(email);
    }, [email]);

    const handleSendEmailCode = () => {
        if (!email) {
            setMsg('이메일을 입력해 주세요.');
            onOpen();
            return;
        }
        sendEmailCodeMutation.mutate(email);
    };

    const handleValidateEmailCode = () => {
        if (!email) {
            setMsg('이메일을 입력해 주세요.');
            onOpen();
            return;
        }
        if (!code) {
            setMsg('인증 코드를 입력해 주세요.');
            onOpen();
            return;
        }
        validateEmailQuery.refetch();
    };

    return (
        <div>
            <div className="space-y-4">
                <div>
                    <label className="block font-semibold">이메일</label>
                    <div className="flex">
                        <input
                            type="email"
                            placeholder="이메일을 입력하세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <div className="mt-2 flex">
                        <input
                            type="text"
                            placeholder="인증번호를 입력하세요"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
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
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    aria-labelledby="modal-title"
                    width="400px"
                    css={{
                        backdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    }}
                >
                    <ModalHeader>
                        <h3 id="modal-title" className="text-xl font-semibold">
                            회원가입
                        </h3>
                    </ModalHeader>
                    <ModalBody>
                        <p>{msg}</p>
                    </ModalBody>
                    <ModalFooter>
                        <button
                            className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition"
                            onClick={onClose}
                        >
                            확인
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    );
};

export default EmailValidation;
