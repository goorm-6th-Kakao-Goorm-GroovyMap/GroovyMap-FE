/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { activeTabState } from '@/recoil/state/userState';
import Posts from '@/components/Mypage/Posts';
import PerformanceRecord from '@/components/Mypage/PerformanceRecord';
import PostRecord from '@/components/Mypage/PostRecord';
import SavedAndLiked from '@/components/Mypage/SavedAndLiked';
import WritePostModal from '@/components/Mypage/Modal/WritePostModal';
import SettingModal from '@/components/Mypage/Modal/SettingModal';
import SkeletonLoader from '@/components/SkeletonLoader';
import { FaCog } from 'react-icons/fa';
import { areas, parts, types } from '@/constants/constants';
import { User } from '@/types/types';

const MyPage: React.FC<{ user: User; isOwner: boolean }> = ({ user, isOwner }) => {
    const [activeTab, setActiveTab] = useRecoilState(activeTabState); // 활성화된 탭 상태를 가져오고 설정
    const [isWritePostOpen, setWritePostOpen] = useState(false); // 게시물 탭의 글쓰기 모달 상태 관리
    const [isSettingsOpen, setIsSettingsOpen] = useState(false); // 설정 버튼 모달 상태 관리

    // 현재 활성화된 탭에 따라 메뉴 렌더링
    const renderContent = () => {
        switch (activeTab) {
            case 'posts':
                return <Posts user={user} isOwner={isOwner} onWritePost={() => setWritePostOpen(true)} />;
            case 'performance':
                return <PerformanceRecord user={user} isOwner={isOwner} />;
            case 'records':
                return <PostRecord user={user} isOwner={isOwner} />;
            case 'saved':
                return <SavedAndLiked user={user} isOwner={isOwner} />;
            default:
                return null;
        }
    };

    // 설정 버튼 클릭 핸들러
    const handleSettings = () => {
        setIsSettingsOpen(true);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
                {/* 프로필 정보 섹션 */}
                <div className="flex items-center mb-6">
                    {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-20 h-20 rounded-full mr-4" />
                    ) : (
                        <div className="w-20 h-20 rounded-full mr-4 bg-gray-300" />
                    )}
                    <div className="flex-grow">
                        <h1 className="text-2xl font-bold">@{user?.nickname}</h1>
                        <p>
                            팔로워: {user?.followers}명 팔로잉: {user?.following}명
                        </p>
                        <p>
                            활동지역: {areas[user?.region || 'ALL'].name} | 분야: {parts[user?.part || 'ALL'].name} |
                            파트: {types[user?.type || 'ALL'].name}
                        </p>
                        <p>{user?.introduction}</p>
                    </div>
                    {isOwner && (
                        <div className="flex space-x-2">
                            {/* isOwner가 true일 때만 설정 버튼을 보여줌 */}
                            <button onClick={handleSettings} className="text-gray-500 hover:text-gray-600">
                                <FaCog size={24} />
                            </button>
                        </div>
                    )}
                </div>
                {/* 탭 메뉴 섹션 */}
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
                {/* 콘텐츠 섹션 */}
                <div className="mt-4">{renderContent()}</div>
            </div>
            {/* 글쓰기 모달과 설정 모달 */}
            {isWritePostOpen && <WritePostModal onClose={() => setWritePostOpen(false)} />}
            {isSettingsOpen && <SettingModal onClose={() => setIsSettingsOpen(false)} />}
        </div>
    );
};

export default MyPage;
