'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();

    const handleMenuClick = (path: string) => {
        router.push(path);
    };

    return (
        <div className="menu-page flex items-center justify-center h-screen">
            <div>
                <h1 className="text-xl text-purple-500 mb-6 text-center">Menu</h1>
                <ul className="menu-list space-y-6 text-center cursor-pointer">
                    <li className="menu-item" onClick={() => handleMenuClick('/')}>홈</li>
                    <li className="menu-item" onClick={() => handleMenuClick('/performance-place')}>공연 장소</li>
                    <li className="menu-item" onClick={() => handleMenuClick('/practice-place')}>연습 장소</li>
                    <li className="menu-item" onClick={() => handleMenuClick('/freeboard')}>자유게시판</li>
                    <li className="menu-item" onClick={() => handleMenuClick('/promotion-place')}>홍보게시판</li>
                    <li className="menu-item" onClick={() => handleMenuClick('/recruitboard')}>팀원 모집</li>
                    <li className="menu-item" onClick={() => handleMenuClick('/profile')}>프로필</li>
                    <li className="menu-item" onClick={() => handleMenuClick('/alogogeneration')}>AI 생성</li>
                </ul>
            </div>
        </div>
    );
}

export default Page;