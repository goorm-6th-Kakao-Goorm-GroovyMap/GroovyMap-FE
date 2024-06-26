'use client';

import { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { activeTabState, userState, myPageUserState } from '@/recoil/state/userState';
import apiClient from '@/api/apiClient';
import { User } from '@/types/types';
import { useParams } from 'next/navigation';
import SkeletonLoader from '@/components/SkeletonLoader';
import Posts from '@/components/Mypage/Posts';
import WritePostModal from '@/components/Mypage/Modal/WritePostModal';
import SettingModal from '@/components/Mypage/Modal/SettingModal';
import { FaCog } from 'react-icons/fa';
import { areas, parts, types } from '@/constants/constants';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import PerformanceRecord from '@/components/Mypage/PerformanceRecord';

const MyPage: React.FC = () => {
    const params = useParams();
    const nickname = Array.isArray(params.nickname) ? params.nickname[0] : params.nickname; // 항상 string 값을 얻도록 보장
    const currentUser = useRecoilValue(userState);
    const [activeTab, setActiveTab] = useRecoilState(activeTabState);
    const setMyPageUser = useSetRecoilState(myPageUserState); // 마이페이지 유저 상태 설정
    const [isWritePostOpen, setWritePostOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // isOwner 변수를 통해 현재 사용자가 자신의 페이지를 보고 있는지 확인함
    const isOwner = currentUser.nickname === nickname;

    // 사용자 데이터를 가져오는 함수
    const fetchUserData = async (nickname: string): Promise<User> => {
        const response = await apiClient.get(`/mypage/${nickname}`);
        return response.data;
    };

    // React Query의 useQuery 훅을 사용하여 데이터를 가져옴
    const {
        refetch, //리패치 추가함 => 변경 내용 자동 업데이트 됨
        data: userData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['userData', nickname],
        queryFn: () => fetchUserData(nickname),
        enabled: !!nickname, // nickname이 존재할 때만 쿼리를 실행
    });

    // userData가 변경될 때마다 myPageUserState를 업데이트함
    useEffect(() => {
        if (userData) {
            setMyPageUser(userData);
            console.log(userData);
        }
    }, [userData, setMyPageUser]);

    // 프로필 이미지 URL 받아온거 => 절대 경로로 변환
    const getProfileImageUrl = (user: User) => {
        const url = user.profileImage || user.profileUrl || '';
        if (url.startsWith('http')) {
            return url;
        }
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:3000';
        return `${backendUrl}${url}`;
    };

    // 활성화된 탭에 따라 콘텐츠를 렌더링하는 함수
    const renderContent = () => {
        if (!userData) {
            return null; // userData가 정의되지 않은 경우 null을 반환
        }
        switch (activeTab) {
            case 'posts':
                return <Posts user={userData} isOwner={isOwner} onWritePost={() => setWritePostOpen(true)} />;
            case 'performance':
                return <PerformanceRecord user={userData} isOwner={isOwner} />;
            default:
                return null;
        }
    };

    // 설정 버튼 클릭 시 설정 모달을 여는 함수
    const handleSettings = () => {
        setIsSettingsOpen(true);
    };

    // 데이터 로딩 중일 때 로딩 스켈레톤을 보여줌
    if (isLoading) {
        return <SkeletonLoader />;
    }

    // 데이터 가져오기 실패 또는 유저 데이터가 없을 때 에러 메시지
    if (isError || !userData) {
        return <p>유저를 찾을 수 없습니다</p>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg  p-8">
                <div className="flex items-center mb-6">
                    {userData.profileImage ? (
                        <Image
                            src={getProfileImageUrl(userData)}
                            width={96}
                            height={96}
                            alt="Profile"
                            className="w-24 h-24 rounded-full mr-4"
                        />
                    ) : (
                        <div className="w-24 h-24 bg-purple-700 text-white flex items-center justify-center rounded-full mr-6">
                            <span className="text-4xl">
                                {userData.nickname ? userData.nickname.charAt(0).toUpperCase() : ''}
                            </span>
                        </div>
                    )}
                    <div className="flex-grow">
                        <h1 className="text-2xl font-bold">@{userData.nickname}</h1>
                        <p>
                            팔로워: {userData.followers}명 팔로잉: {userData.following}명
                        </p>
                        <p>
                            활동지역: {areas[userData.region || 'ALL'].name} | 분야:{' '}
                            {parts[userData.part || 'ALL'].name} | 파트: {types[userData.type || 'ALL'].name}
                        </p>
                        <p>{userData.introduction}</p>
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
                </div>
                <div className="mt-4">{renderContent()}</div>
            </div>
            {isWritePostOpen && <WritePostModal onClose={() => setWritePostOpen(false)} onPostCreated={refetch} />}
            {isSettingsOpen && <SettingModal onClose={() => setIsSettingsOpen(false)} onProfileUpdate={refetch} />}
        </div>
    );
};

export default MyPage;
