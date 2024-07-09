/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { FaBell, FaPaperPlane } from 'react-icons/fa';
import { IoMdPerson } from 'react-icons/io';
import { useRouter } from 'next/navigation'; // 사용자 아이콘 눌렀을 때 로그인으로 이동할 때 필요
import Image from 'next/image';
import { useRecoilValue, useResetRecoilState } from 'recoil'; // useResetRecoilState를 사용합니다.
import { userState, initialUserState } from '@/recoil/state/userState';
import apiClient from '@/api/apiClient';
import { toast } from 'react-toastify';

const RightSidebar = () => {
    const router = useRouter();
    const user = useRecoilValue(userState);
    const resetUser = useResetRecoilState(userState); // 초기화 함수
    const [showMenu, setShowMenu] = useState(false);
    const [isMounted, setIsMounted] = useState(false); // 클라이언트 측에서만 렌더링하도록 상태 추가
    const [currentSlide, setCurrentSlide] = useState(0); // 슬라이드 상태

    useEffect(() => {
        setIsMounted(true);
    }, []); // 컴포넌트가 마운트되었을 때 상태를 true로 설정

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 10000); // 10초마다 슬라이드 전환시킴

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }, []);

    // 비로그인 사용자 아이콘 클릭 시, 로그인 페이지로 이동
    const handleUserIconClick = () => {
        router.push('/login');
    };

    // 사용자 로그인 후, 로그아웃 클릭 시 로그아웃
    const handleLogout = async () => {
        try {
            await apiClient.post('/logout', {}, { withCredentials: true });
            resetUser(); // Recoil 상태 초기화
            if (typeof window !== 'undefined') {
                window.sessionStorage.removeItem('recoil-persist'); // 세션 스토리지에서 Recoil 상태 제거함
            }
            toast.success('로그아웃에 성공했습니다!');
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('로그아웃에 실패했습니다.');
        }
    };

    // 마이페이지 버튼 클릭 시 동적으로 사용자 마이페이지로 이동하기 추가
    const handleMyPageClick = () => {
        if (user.nickname) {
            router.push(`/mypage/${user.nickname}`);
        }
    };

    //
    const handleDMClick = () => {
        if (user.nickname) {
            router.push(`/dm/${user.nickname}`);
        }
    };

    const getProfileImageUrl = (userProfileUrl: string | undefined) => {
        if (!userProfileUrl) return '';
        if (typeof userProfileUrl === 'string' && userProfileUrl.startsWith('http')) return userProfileUrl;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:8080';
        return `${backendUrl}${userProfileUrl}`;
    };

    // 버스킹 장소 이미지 클릭 시 이동하는 함수
    const handleBuskingLinkClick = () => {
        window.location.href = 'https://www.mapo.go.kr/site/culture/stage/app_step_01';
    };

    // 버스킹 장소 슬라이드 내용
    const slides = [
        {
            image: '/busking1.jpg',
            text: '<br>2024<br>서울 거리공연<br>구석구석 라이브<br> <span>-</span><br>서울 전역 50곳에서<br>펼쳐지는 거리공연',
            link: 'https://nodeul.org/program/2024-%ec%84%9c%ec%9a%b8%ea%b1%b0%eb%a6%ac%ea%b3%b5%ec%97%b0-%ea%b5%ac%ec%84%9d%ea%b5%ac%ec%84%9d%eb%9d%bc%ec%9d%b4%eb%b8%8c/',
        },
        {
            image: '/busking3.jpg',
            text: '<br>2024 서울<br>국제댄스페스티벌<br>인 탱크<br> <span>-</span><br>인탱크 서포터즈 <br>4기 모집<br>',
            link: 'https://ingdance.kr/62/?q=YToxOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjt9&bmode=view&idx=26275872&t=board',
        },
    ];

    if (!isMounted) {
        return null;
    }

    return (
        <div className='w-64 bg-purple-50 p-6 flex flex-col justify-between h-full'>
            <div className='flex flex-row items-center justify-around mb-6 mt-6'>
                <FaPaperPlane onClick={handleDMClick} size={24} className='text-black cursor-pointer' />
                <FaBell size={24} className='text-black cursor-pointer' />
                <div className='relative'>
                    {user.nickname ? ( // user 객체의 nickname 속성이 있는지 확인하여 로그인 상태인지 판단
                        <div
                            className='relative bg-purple-700 p-2 rounded-full cursor-pointer'
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            {user.profileUrl ? (
                                <div className='relative w-8 h-8 rounded-full overflow-hidden'>
                                    <Image
                                        src={getProfileImageUrl(user.profileUrl) || user.profileUrl}
                                        alt='User Profile'
                                        fill
                                        priority
                                        style={{ objectFit: 'cover' }} // objectFit 대체
                                        className='rounded-full'
                                    />
                                </div>
                            ) : (
                                <div className='w-8 h-8 bg-purple-700 text-white flex items-center justify-center rounded-full'>
                                    {user.nickname.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='bg-purple-700 p-2 rounded-full cursor-pointer' onClick={handleUserIconClick}>
                            <IoMdPerson size={24} className='text-white' />
                        </div>
                    )}
                    {showMenu && (
                        <div
                            className='absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50'
                            onMouseEnter={() => setShowMenu(true)}
                            onMouseLeave={() => setShowMenu(false)}
                        >
                            <button
                                className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
                                onClick={handleMyPageClick}
                            >
                                마이페이지
                            </button>
                            <button
                                className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
                                onClick={handleLogout}
                            >
                                로그아웃
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className='bg-white p-4 rounded-lg text-center flex-grow flex items-center justify-center relative'>
                <Image
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].text}
                    fill
                    priority
                    sizes='(max-width: 768px) 100vw, 50vw' // 필요한 sizes 속성 추가
                    style={{ objectFit: 'cover' }}
                    className='cursor-pointer'
                    onClick={() => (window.location.href = slides[currentSlide].link)}
                />
                <p
                    className='gradient-text z-50 font-medium text-xl mt-4 cursor-pointer'
                    onClick={() => (window.location.href = slides[currentSlide].link)}
                    dangerouslySetInnerHTML={{ __html: slides[currentSlide].text }}
                ></p>
            </div>
            <div className='flex justify-center mt-2'>
                {slides.map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setCurrentSlide(index)} // 클릭 시 슬라이드 전환
                        className={`mx-1 h-2 w-2 rounded-full cursor-pointer ${currentSlide === index ? 'bg-purple-700' : 'bg-gray-300'}`}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default RightSidebar;
