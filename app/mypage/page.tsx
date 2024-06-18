/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, activeTabState } from '@/recoil/state/userState';
import Posts from '@/components/Mypage/Posts';
import PerformanceRecord from '@/components/Mypage/PerformanceRecord';
import PostRecord from '@/components/Mypage/PostRecord';
import SavedAndLiked from '@/components/Mypage/SavedAndLiked';
import WritePostModal from '@/components/Mypage/WritePostModal';
import SettingModal from '@/components/Mypage/SettingModal';
import SkeletonLoader from '@/components/SkeletonLoader';
import { FaCog } from 'react-icons/fa';
import { translateRegion, translatePart, translateType } from '@/constants/translate';

const MyPage: React.FC = () => {
    const [activeTab, setActiveTab] = useRecoilState(activeTabState);
    const user = useRecoilValue(userState);
    const [isWritePostOpen, setWritePostOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'posts':
                return <Posts onWritePost={() => setWritePostOpen(true)} />;
            case 'performance':
                return <PerformanceRecord onWritePost={() => setWritePostOpen(true)} />;
            case 'records':
                return <PostRecord />;
            case 'saved':
                return <SavedAndLiked />;
            default:
                return null;
        }
    };

    const handleSettings = () => {
        setSettingsOpen(true);
    };

    if (!user) {
        return <SkeletonLoader />;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
                {/* 프로필 정보 */}
                <div className="flex items-center mb-6">
                    {user.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-20 h-20 rounded-full mr-4" />
                    ) : (
                        <div className="w-20 h-20 rounded-full mr-4 bg-gray-300" />
                    )}
                    <div className="flex-grow">
                        <h1 className="text-2xl font-bold">@{user.nickname}</h1>
                        <p>
                            팔로워: {user.followers}명 팔로잉: {user.following}명
                        </p>
                        <p>
                            활동지역: {translateRegion(user.region)} 분야: {translatePart(user.part)} 파트:{' '}
                            {translateType(user.type)}
                        </p>
                        <p>{user.bio}</p>
                    </div>
                    <div className="flex space-x-2">
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
