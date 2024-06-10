'use client';

import React, { useState, useMemo } from 'react';
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
import { validateNickname, validatePassword } from '@/utils/validation';
import apiClient from '@/api/apiClient';
import confetti from 'canvas-confetti';
import { AxiosError } from 'axios';
import { IoChevronBackSharp } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

//이메일 타입
interface EmailProps {
    validEmail: string;
}

const NicknamePassword: React.FC<EmailProps> = ({ validEmail }) => {
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordCodeSent, setIsPasswordCodeSent] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    const isNicknameValid = useMemo(() => {
        if (!nickname) return true;
        return validateNickname(nickname);
    }, [nickname]);

    const isPasswordValid = useMemo(() => {
        if (!password) return true;
        return validatePassword(password);
    }, [password]);

    const isPasswordSame = useMemo(() => {
        if (!confirmPassword) return true;
        return password === confirmPassword;
    }, [password, confirmPassword]);

    const canSignUp = useMemo(() => {
        return isNicknameValid && isPasswordValid && isPasswordSame;
    }, [isNicknameValid, isPasswordValid, isPasswordSame]);

    const handleSignup = async () => {
        if (!canSignUp) {
            setMsg('입력 정보를 확인해주세요.');
            onOpen();
            return;
        }

        try {
            const response = await apiClient.post('/sign-up', {
                email: validEmail,
                password,
                nickname,
            });

            if (response.status === 200) {
                setMsg('회원가입에 성공했습니다!');
                onOpen();
                confetti({
                    particleCount: 100,
                    spread: 160,
                });
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                const message = error.response?.data?.message || '회원가입에 실패했습니다.';
                setMsg(message);
                onOpen();
            } else {
                setMsg('알 수 없는 오류가 발생했습니다.');
                onOpen();
            }
        }
    };

    const handleCheckNickname = async () => {
        try {
            const response = await apiClient.post('/check-nickname', { nickname });
            if (response.status === 200) {
                setMsg('사용 가능한 닉네임입니다.');
                onOpen();
            } else {
                setMsg('이미 사용 중인 닉네임입니다.');
                onOpen();
            }
        } catch (error) {
            setMsg('닉네임 확인에 실패했습니다.');
            onOpen();
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block font-semibold">닉네임</label>
                <div className="flex">
                    <input
                        type="text"
                        placeholder="닉네임을 입력하세요"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
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
            <div className="my-3 h-3 text-sm text-red-500">
                {!isNicknameValid && '닉네임은 특수 문자 제외 2자 이상 13자 이하이어야 합니다.'}
            </div>
            <div>
                <label className="block font-semibold">비밀번호</label>
                <div className="flex">
                    <input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>
                <div className="mt-2 flex">
                    <input
                        type="text"
                        placeholder="비밀번호를 한번 더 입력해주세요."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>
            </div>
            <div className="my-3 h-3 text-sm text-red-500">{!isPasswordSame && '비밀번호가 일치하지 않습니다.'}</div>
            <button
                className={`w-full bg-purple-500 curso text-white py-3 rounded-lg transition transform duration-300 ${
                    canSignUp ? 'hover:bg-purple-600 hover:scale-105' : 'bg-gray-300 cursor-not-allowed'
                }`}
                onClick={handleSignup}
                disabled={!canSignUp}
            >
                가입 완료
            </button>
            <Modal size="sm" isOpen={isOpen} onClose={onClose} placement="center">
                <ModalHeader>
                    <h3 id="modal-title" className="text-xl font-semibold text-white">
                        회원가입
                    </h3>
                </ModalHeader>
                <ModalBody>
                    <p className="text-sm">{msg}</p>
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
    );
};

export default NicknamePassword;
