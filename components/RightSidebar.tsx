'use client';

import { useState } from 'react';
import { FaBell, FaPaperPlane } from 'react-icons/fa';
import { IoMdPerson } from 'react-icons/io';
import { useRouter } from 'next/navigation'; // 사용자 아이콘 눌렀을 때 로그인으로 이동할 때 필요
import Image from 'next/image';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '@/recoil/state/userState';
import apiClient from '@/api/apiClient';

const RightSidebar = () => {
    const router = useRouter();
    const user = useRecoilValue(userState);
    const setUser = useSetRecoilState(userState);
    const [showMenu, setShowMenu] = useState(false);

    // 비로그인 사용자 아이콘 클릭 시, 로그인 페이지로 이동
    const handleUserIconClick = () => {
        router.push('/login');
    };

    // 사용자 로그인 후, 로그아웃 클릭 시 로그아웃
    const handleLogout = async () => {
        try {
            await apiClient.post('/logout', {}, { withCredentials: true });
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // 마이페이지 버튼 클릭 시 동적으로 사용자 마이페이지로 이동하기 추가
    const handleMyPageClick = () => {
        if (user) {
            router.push(`/mypage`);
        }
    };

    return (
        <div className="w-64 bg-purple-50 p-6 flex flex-col justify-between h-full">
            <div className="flex flex-row items-center justify-around mb-6 mt-6">
                <FaPaperPlane size={24} className="text-black cursor-pointer" />
                <FaBell size={24} className="text-black cursor-pointer" />
                <div className="relative">
                    {user ? (
                        <div
                            className="relative bg-purple-700 p-2 rounded-full cursor-pointer"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                    src={user.profileImage || '/profile.jpeg'}
                                    alt="User Profile"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-purple-700 p-2 rounded-full cursor-pointer" onClick={handleUserIconClick}>
                            <IoMdPerson size={24} className="text-white" />
                        </div>
                    )}
                    {showMenu && (
                        <div
                            className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50"
                            onMouseEnter={() => setShowMenu(true)}
                            onMouseLeave={() => setShowMenu(false)}
                        >
                            <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={handleMyPageClick}
                            >
                                마이페이지
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={handleLogout}
                            >
                                로그아웃
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center flex-grow flex items-center justify-center">
                <p className="text-gray-700 font-semibold text-xl">버스킹 링크</p>
            </div>
        </div>
    );
};

export default RightSidebar;
