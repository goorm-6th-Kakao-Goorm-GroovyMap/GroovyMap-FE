'use client';

import { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { activeTabState, userState, myPageUserState } from '@/recoil/state/userState';
import apiClient from '@/api/apiClient';
import { User } from '@/types/types';
import { useParams, useRouter } from 'next/navigation';
import SkeletonLoader from '@/components/SkeletonLoader';
import Posts from '@/components/Mypage/Posts';
import WritePostModal from '@/components/Mypage/Modal/WritePostModal';
import SettingModal from '@/components/Mypage/Modal/SettingModal';
import { FaCog, FaPlus, FaPaperPlane } from 'react-icons/fa';
import { areas, parts, types } from '@/constants/constants';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import PerformanceRecord from '@/components/Mypage/PerformanceRecord';
import FollowListModal from '@/components/Mypage/Modal/FollowListModal'; // 팔로우&팔로잉 리스트 보여주는 모달 추가
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const nickname = Array.isArray(params.nickname) ? params.nickname[0] : params.nickname; // 항상 string 값을 얻도록 보장
    const currentUser = useRecoilValue(userState);
    const [activeTab, setActiveTab] = useRecoilState(activeTabState);
    const setMyPageUser = useSetRecoilState(myPageUserState); // 마이페이지 유저 상태 설정
    const [isWritePostOpen, setWritePostOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isFollowListOpen, setIsFollowListOpen] = useState(false);
    const [followListType, setFollowListType] = useState<'followers' | 'following'>('followers');
    const [followersCount, setFollowersCount] = useState<number>(0);
    const [followingCount, setFollowingCount] = useState<number>(0);

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

    // userData가 변경될 때마다 myPageUserState를 업데이트함, 팔로우 팔로잉 숫자도 업데이트
    useEffect(() => {
        if (userData && currentUser) {
            setMyPageUser(userData);
            setIsOwner(currentUser.nickname === userData.nickname);
            setFollowersCount(userData.followers);
            setFollowingCount(userData.following);
        }
    }, [userData, currentUser, setMyPageUser]);

    // 프로필 이미지 띄워줄때 URL 받아온거 => 절대 경로로 변환
    const getProfileImageUrl = (user: User) => {
        const url = user.profileImage || user.profileUrl || '';
        if (url.startsWith('http')) {
            return url;
        }
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:8080';
        return `${backendUrl}${url}`;
    };

    //팔로우 몇명인지 클릭시 요청하고 모달에 리스트 보여줌
    const handleFollow = async () => {
        if (!userData) return; // userData가 없을 경우 처리

        try {
            const response = await apiClient.post(
                `/mypage/following/${userData.nickname}`, // URL에 마이페이지 유저의 닉네임 포함
                {
                    nickname: currentUser.nickname,
                    followNickname: userData.nickname, // 현재 로그인 유저가 보고 있는 마이페이지 유저를 팔로잉 함.
                },
                { withCredentials: true }
            );
            if (response.data.success) {
                refetch(); // 팔로우 후 리패치하여 UI 업데이트
                setFollowersCount((prev) => prev + 1); // 팔로워 숫자 증가
                if (!toast.isActive('followSuccess')) {
                    // toastId를 사용하여 중복 방지
                    toast.success(`${userData.nickname}님을 팔로우 하였습니다.`, { toastId: 'followSuccess' });
                }
            }
        } catch (error) {
            console.error('팔로우 중 오류가 발생했습니다:', error);
            if (!toast.isActive('followError')) {
                // toastId를 사용하여 중복 방지
                toast.error('팔로우 중 오류가 발생했습니다.', { toastId: 'followError' });
            }
        }
    };

    const updateFollowerCounts = (delta: number) => {
        setFollowersCount((prevCount) => prevCount + delta);
    };

    const updateFollowingCounts = (delta: number) => {
        setFollowingCount((prevCount) => prevCount + delta);
    };

    // 활성화된 탭에 따라 콘텐츠를 렌더링하는 함수
    const renderContent = () => {
        if (!userData) {
            return null; // userData가 정의되지 않은 경우 null을 반환
        }
        switch (activeTab) {
            case 'posts':
                return (
                    <Posts
                        currentUser={currentUser}
                        user={userData}
                        isOwner={isOwner}
                        onWritePost={() => setWritePostOpen(true)}
                    />
                );
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
    const handleDM = async () => {
        if (!userData) return; // userData가 없을 경우 처리

        try {
            const response = await apiClient.get('/message/nickname', {
                params: { nickname: userData.nickname },
                withCredentials: true,
            });
            router.push(`/dm/${currentUser.nickname}`);
        } catch (error) {
            console.error('메시지 가져오는 중 오류가 발생했습니다:', error);
            if (!toast.isActive('dmError')) {
                toast.error('메시지 가져오는 중 오류가 발생했습니다.', { toastId: 'dmError' });
            }
        }
    };

    return (
        <div className='flex flex-col items-center min-h-screen p-4'>
            <div className='w-full max-w-4xl bg-white rounded-lg  p-8'>
                <div className='relative flex items-center mb-6'>
                    {userData.profileImage ? (
                        <Image
                            src={getProfileImageUrl(userData)}
                            width={96}
                            height={96}
                            priority
                            alt='Profile'
                            sizes='(max-width: 600px) 100vw, 50vw'
                            className='w-24 h-24 rounded-full mr-4'
                        />
                    ) : (
                        <div className='w-24 h-24 bg-purple-700 text-white flex items-center justify-center rounded-full mr-6'>
                            <span className='text-4xl'>
                                {userData.nickname ? userData.nickname.charAt(0).toUpperCase() : ''}
                            </span>
                        </div>
                    )}
                    <div className='flex-grow'>
                        <h1 className='text-2xl font-bold text-purple-500'>@{userData.nickname}</h1>
                        <div className='flex items-center mt-1 text-gray-600 space-x-4'>
                            <span className='font-semibold'>
                                팔로워:
                                <button
                                    className='cursor-pointer'
                                    onClick={() => {
                                        setFollowListType('followers');
                                        //팔로워 버튼 클릭시 팔로워 목록 모달 오픈함
                                        setIsFollowListOpen(true);
                                    }}
                                >
                                    {followersCount}명
                                </button>
                            </span>
                            <span className='font-semibold'>
                                팔로잉:
                                <button
                                    className='cursor-pointer'
                                    onClick={() => {
                                        //팔로잉 목록 클릭시 팔로잉 모달 오픈
                                        setFollowListType('following');
                                        setIsFollowListOpen(true);
                                    }}
                                >
                                    {followingCount}명
                                </button>
                            </span>
                        </div>
                        <p className='mt-1'>
                            <div className='flex items-center text-gray-600 space-x-2'>
                                <span>활동 지역:</span>
                                <span className='text-gray-500 bg-gray-100 p-0.5 rounded-sm'>
                                    {areas[userData.region || 'ALL'].name}
                                </span>
                                <span>분야:</span>
                                <span className='text-gray-500 bg-gray-100 p-0.5 rounded-sm'>
                                    {parts[userData.part || 'ALL'].name}
                                </span>
                                <span>파트:</span>
                                <span className='text-gray-500 bg-gray-100 p-0.5 rounded-sm'>
                                    {types[userData.type || 'ALL'].name}
                                </span>
                            </div>
                        </p>
                        <p className='mt-1'>{userData.introduction}</p>
                    </div>
                    {isOwner ? (
                        <div className='flex space-x-2'>
                            {/* isOwner가 true일 때만 설정 버튼을 보여줌 */}
                            <button onClick={handleSettings} className='text-gray-500 hover:text-gray-600'>
                                <FaCog size={24} />
                            </button>
                        </div>
                    ) : (
                        <div className='flex space-x-2'>
                            <button
                                onClick={handleFollow}
                                className='bg-purple-500 hover:bg-purple-700 text-white px-2 py-2 rounded-lg'
                            >
                                <FaPlus size={12} />
                            </button>
                            <button
                                onClick={handleDM}
                                className='bg-purple-500 hover:bg-purple-700 text-white px-2 py-2 rounded-lg'
                            >
                                <FaPaperPlane size={12} />
                            </button>
                        </div>
                    )}
                </div>
                <div className='flex justify-around mb-6 border-b pb-2'>
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
                <div className='mt-4'>{renderContent()}</div>
            </div>
            {isWritePostOpen && <WritePostModal onClose={() => setWritePostOpen(false)} onPostCreated={refetch} />}
            {isSettingsOpen && <SettingModal onClose={() => setIsSettingsOpen(false)} onProfileUpdate={refetch} />}
            {/* 팔로우 팔로잉 리스트 모달 오픈 true 일때 */}
            {isFollowListOpen && (
                //팔로우 팔로잉 타입 전달, 유저 닉네임 전달
                <FollowListModal
                    updateFollowingCounts={updateFollowingCounts} // 팔로잉 업데이트 함수 전달
                    nickname={nickname}
                    type={followListType}
                    onClose={() => setIsFollowListOpen(false)}
                />
            )}
        </div>
    );
};

export default MyPage;
