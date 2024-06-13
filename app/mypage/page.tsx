'use client';

import React from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/state/signupState';

const MyPage: React.FC = () => {
    const user = useRecoilValue(userState);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">마이페이지</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-2">이메일</label>
                        <p>{user.email}</p>
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">닉네임</label>
                        <p>{user.nickname}</p>
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">지역</label>
                        <p>{user.region}</p>
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">분야</label>
                        <p>{user.part}</p>
                    </div>
                    {user.subPart && (
                        <div>
                            <label className="block font-semibold mb-2">세부 분야</label>
                            <p>{user.subPart}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyPage;
