'use client';

import React, { useState } from 'react';
import EmailValidation from './components/EmailValidation';
import NicknamePassword from './components/NicknamePassword';

const Signup = () => {
    const [emailValidate, setEmailValidate] = useState(false);
    const [validEmail, setValidEmail] = useState('');

    const handleEmailValidate = (email: string) => {
        setEmailValidate(true);
        setValidEmail(email);
    };

    return (
        <>
            <title>그루비 맵 | 회원가입</title>
            <div className="flex h-full w-100 flex-col items-center justify-center min-h-screen py-12 bg-gray-50">
                <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-center mb-8">회원가입</h1>
                    <div className="space-y-8">
                        <EmailValidation onEmailValidate={handleEmailValidate} />
                        {/* {emailValidate && <NicknamePassword validEmail={validEmail} />} */}
                        <NicknamePassword validEmail={validEmail} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
