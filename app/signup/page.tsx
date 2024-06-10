'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [emailCode, setEmailCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCode, setPasswordCode] = useState('');
    const [nickname, setNickname] = useState('');

    const handleSendEmailCode = () => {
        // 이메일 인증 코드 보내기 로직 들어가야 함
        console.log('Send email code to:', email);
    };

    const handleVerifyEmailCode = () => {
        // 이메일 인증 코드 확인 로직 들어가야 함
        console.log('Verify email code:', emailCode);
    };

    const handleSendPasswordCode = () => {
        // 비밀번호 인증 코드 보내기 로직
        console.log('Send password code');
    };

    const handleVerifyPasswordCode = () => {
        // 비밀번호 인증 코드 확인 로직
        console.log('Verify password code:', passwordCode);
    };

    const handleCheckNickname = () => {
        // 닉네임 중복 확인 로직
        console.log('Check nickname:', nickname);
    };

    const handleSignup = (event) => {
        event.preventDefault();
        // 회원가입 로직
        console.log('Signup with:', { email, password, nickname });
    };

    return (
        <>
            <title>그루비 맵 | 회원가입</title>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>
                    <form className="space-y-4" onSubmit={handleSignup}>
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
                                    value={emailCode}
                                    onChange={(e) => setEmailCode(e.target.value)}
                                    className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyEmailCode}
                                    className="w-32 bg-purple-500 text-white hover:bg-purple-600 rounded-r-lg transition transform duration-300 hover:scale-105"
                                >
                                    인증번호 확인
                                </button>
                            </div>
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
                                <button
                                    type="button"
                                    onClick={handleSendPasswordCode}
                                    className="w-32 bg-purple-500 text-white hover:bg-purple-600 rounded-r-lg transition transform duration-300 hover:scale-105"
                                >
                                    인증번호 보내기
                                </button>
                            </div>
                            <div className="mt-2 flex">
                                <input
                                    type="text"
                                    placeholder="인증번호를 입력하세요"
                                    value={passwordCode}
                                    onChange={(e) => setPasswordCode(e.target.value)}
                                    className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyPasswordCode}
                                    className="w-32 bg-purple-500 text-white hover:bg-purple-600 rounded-r-lg transition transform duration-300 hover:scale-105"
                                >
                                    인증번호 확인
                                </button>
                            </div>
                        </div>

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

                        <button
                            type="submit"
                            className="w-full bg-purple-500 text-white hover:bg-purple-600 py-3 rounded-lg transition transform duration-300 hover:scale-105"
                        >
                            가입하기
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};
export default Signup;
