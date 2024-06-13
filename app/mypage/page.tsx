// src/app/mypage/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userState, activeTabState } from '@/recoil/state/userState';
import Posts from '@/components/Mypage/Posts';
import PerformanceRecord from '@/components/Mypage/PerformanceRecord';
import PostRecord from '@/components/Mypage/PostRecord';
import SavedAndLiked from '@/components/Mypage/SavedAndLiked';
import WritePostModal from '@/components/Mypage/WritePostModal';
import SettingModal from '@/components/Mypage/SettingModal';
import apiClient from '@/api/apiClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import SkeletonLoader from '@/components/SkeletonLoader';
import { FaPen, FaCog } from 'react-icons/fa';

const MyPage: React.FC = () => {
    const queryClient = useQueryClient();
    const setUser = useSetRecoilState(userState);
    const [activeTab, setActiveTab] = useRecoilState(activeTabState);
    const [isWritePostOpen, setWritePostOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);

    const getUserInfo = async () => {
        const response = await apiClient.get('/user/info');
        return response.data;
    };
    // 리액트 쿼리를 사용하여 유저 정보 가져오기
    const { data, error, isLoading } = useQuery({
        queryKey: ['userInfo'],
        queryFn: getUserInfo,
        onSuccess: (data) => {
            setUser(data);
        },
        onError: () => {
            toast.error('유저 정보를 가져오는데 실패했습니다.');
        },
    });

    //탭마다 메뉴 변경되어 각 컴포넌트 렌더링
    const renderContent = () => {
        switch (activeTab) {
            case 'posts':
                return <Posts />;
            case 'performance':
                return <PerformanceRecord />;
            case 'records':
                return <PostRecord />;
            case 'saved':
                return <SavedAndLiked />;
            default:
                return null;
        }
    };

    const handleWritePost = () => {
        setWritePostOpen(true);
    };

    const handleSettings = () => {
        setSettingsOpen(true);
    };

    //로딩시 처리
    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (error) {
        return <div>유저 정보를 가져오는 중 오류가 발생했습니다.</div>;
    }

    if (!data) {
        return <div>유저 정보를 불러올 수 없습니다.</div>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
                {/* 프로필 정보 */}
                <div className="flex items-center mb-6">
                    {data.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={data.profileImage} alt="Profile" className="w-20 h-20 rounded-full mr-4" />
                    ) : (
                        <div className="w-20 h-20 rounded-full mr-4 bg-gray-300" />
                    )}
                    <div className="flex-grow">
                        <h1 className="text-2xl font-bold">@{data.nickname}</h1>
                        <p>
                            팔로워: {data.followers}명 팔로잉: {data.following}명
                        </p>
                        <p>
                            활동지역: {data.region} 분야: {data.part} 파트: {data.subPart}
                        </p>
                        <p>{data.bio}</p>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={handleWritePost} className="text-purple-500 hover:text-purple-600">
                            <FaPen size={24} />
                        </button>
                        <button onClick={handleSettings} className="text-gray-500 hover:text-gray-600">
                            <FaCog size={24} />
                        </button>
                    </div>
                </div>
                {/* 탭 메뉴 */}
                <div className="flex justify-around mb-6 border-b pb-2">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`px-4 py-2 ${activeTab === 'posts' ? 'border-b-2 border-purple-500 text-purple-500' : 'text-gray-500'}`}
                    >
                        게시물
                    </button>
                    <button
                        onClick={() => setActiveTab('performance')}
                        className={`px-4 py-2 ${activeTab === 'performance' ? 'border-b-2 border-purple-500 text-purple-500' : 'text-gray-500'}`}
                    >
                        공연 기록
                    </button>
                    <button
                        onClick={() => setActiveTab('records')}
                        className={`px-4 py-2 ${activeTab === 'records' ? 'border-b-2 border-purple-500 text-purple-500' : 'text-gray-500'}`}
                    >
                        글 기록
                    </button>
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`px-4 py-2 ${activeTab === 'saved' ? 'border-b-2 border-purple-500 text-purple-500' : 'text-gray-500'}`}
                    >
                        저장/좋아요
                    </button>
                </div>
                {/* 콘텐츠 */}
                <div className="mt-4">{renderContent()}</div>
            </div>
            {isWritePostOpen && <WritePostModal onClose={() => setWritePostOpen(false)} />}
            {isSettingsOpen && <SettingModal onClose={() => setSettingsOpen(false)} />}
        </div>
    );
};

export default MyPage;
