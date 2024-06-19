/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, activeTabState } from '@/recoil/state/userState';
import Posts from '@/components/Mypage/Posts';
import PerformanceRecord from '@/components/Mypage/PerformanceRecord';
import PostRecord from '@/components/Mypage/PostRecord';
import SavedAndLiked from '@/components/Mypage/SavedAndLiked';
import WritePostModal from '@/components/Mypage/Modal/WritePostModal';
import SettingModal from '@/components/Mypage/Modal/SettingModal';
import SkeletonLoader from '@/components/SkeletonLoader';
import { FaCog } from 'react-icons/fa';
import { areas, parts, types } from '@/constants/constants';
import { usePathname, useParams } from 'next/navigation';
import apiClient from '@/api/apiClient';
import { User } from '@/types/types';

const MyPage: React.FC<{ user: any; isOwner: boolean }> = ({ user, isOwner }) => {
    const [activeTab, setActiveTab] = useRecoilState(activeTabState); // 활성화된 탭 상태를 가져오고 설정
    const [profileUser, setProfileUser] = useState(user); // 프로필 사용자 상태
    const [isWritePostOpen, setWritePostOpen] = useState(false); // 게시물 탭의 글쓰기 모달 상태 관리
    const [isSettingsOpen, setIsSettingsOpen] = useState(false); // 설정 버튼 모달 상태 관리
    const [isLoading, setIsLoading] = useState(!user); // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 상태
    const { id } = useParams(); // URL에서 사용자 ID를 추출

    // 프로필 사용자 데이터를 가져오는 함수
    const fetchUserProfile = async (memberId: string) => {
        try {
            const response = await apiClient.get(`/mypage/${memberId}`);
            setProfileUser(response.data);
        } catch (error) {
            setError('Error fetching user data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!profileUser && id) {
            // URL의 ID가 있을 경우 다른 사용자 정보 가져오기
            fetchUserProfile(id as string);
        } else {
            // 프로필 사용자 정보가 이미 있으면 로딩 상태를 false로 설정
            setIsLoading(false);
        }
    }, [id, profileUser]);

    // 현재 활성화된 탭에 따라 메뉴 렌더링
    const renderContent = () => {
        switch (activeTab) {
            case 'posts':
                return <Posts user={profileUser} isOwner={isOwner} onWritePost={() => setWritePostOpen(true)} />;
            case 'performance':
                return <PerformanceRecord user={profileUser} isOwner={isOwner} />;
            case 'records':
                return <PostRecord user={profileUser} isOwner={isOwner} />;
            case 'saved':
                return <SavedAndLiked user={profileUser} isOwner={isOwner} />;
            default:
                return null;
        }
    };

    // 설정 버튼 클릭 핸들러
    const handleSettings = () => {
        setIsSettingsOpen(true);
    };

    // 사용자 정보가 없으면 로딩 스켈레톤을 보여줌
    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
                {/* 프로필 정보 섹션 */}
                <div className="flex items-center mb-6">
                    {profileUser?.profileImage ? (
                        <img src={profileUser.profileImage} alt="Profile" className="w-20 h-20 rounded-full mr-4" />
                    ) : (
                        <div className="w-20 h-20 rounded-full mr-4 bg-gray-300" />
                    )}
                    <div className="flex-grow">
                        <h1 className="text-2xl font-bold">@{profileUser?.nickname}</h1>
                        <p>
                            팔로워: {profileUser?.followers}명 팔로잉: {profileUser?.following}명
                        </p>
                        <p>
                            활동지역: {areas[profileUser?.region || 'ALL'].name} | 분야:{' '}
                            {parts[profileUser?.part || 'ALL'].name} | 파트: {types[profileUser?.type || 'ALL'].name}
                        </p>
                        <p>{profileUser?.introduction}</p>
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
