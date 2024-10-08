'use client';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import ChatRoom from '@/components/DM/ChatRoom';
import apiClient from '@/api/apiClient';
import { chatRoomsState, selectedChatRoomState, userState } from '@/recoil/state/userState';
import Image from 'next/image';
import { IoMdSearch } from 'react-icons/io';
import { FaHandSparkles } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';

const DMPage = () => {
    const [user] = useRecoilState(userState);
    const [chatRooms, setChatRooms] = useRecoilState(chatRoomsState);
    const [selectedChatRoom, setSelectedChatRoom] = useRecoilState(selectedChatRoomState);
    const [receiverId, setReceiverId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [otherUserNickname, setOtherUserNickname] = useState<string>('');

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (user?.nickname) {
            apiClient
                .get('/message-room', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    const sortedChatRooms = response.data.sort(
                        (a: any, b: any) =>
                            new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
                    );
                    setChatRooms(sortedChatRooms);
                })
                .catch((error) => console.error('Error fetching chat rooms:', error));
        }
    }, [user, setChatRooms]);

    const handleChatRoomClick = (chatRoomId: string, otherUserNickname: string) => {
        setOtherUserNickname(otherUserNickname);
        setSelectedChatRoom(null);
        setTimeout(() => {
            apiClient
                .get('/profile', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    const userProfile = response.data.find((profile: any) => profile.nickname === otherUserNickname);
                    if (userProfile) {
                        setReceiverId(userProfile.memberId);
                        setSelectedChatRoom(chatRoomId);
                    } else {
                        console.error('User not found');
                    }
                })
                .catch((error) => console.error('Error fetching profile:', error));
        }, 0);
    };

    const handleBackToList = () => {
        setSelectedChatRoom(null);
        setReceiverId(null);
    };

    return (
        <div className='content p-6 bg-purple-50 min-h-screen flex flex-col'>
            <div className='w-full max-w-4xl mx-auto'>
                <div className='flex justify-center items-center mb-6'></div>
                <header className='mb-6'>
                    <h1 className='text-2xl text-purple-700'>Messages</h1>
                    <p className='text-red-700'>!상대방과 자신의 프로필을 등록한 상태에서만 이용가능합니다</p>
                </header>
            </div>
            <div className='flex-1 flex h-0'>
                {/* DM 목록 표시 */}
                {(!isMobile || !selectedChatRoom) && (
                    <div className='w-full md:w-1/3 border-r border-gray-200 overflow-y-auto'>
                        {chatRooms?.length > 0 ? (
                            chatRooms.map((chatRoom: any, index: number) => (
                                <div
                                    key={chatRoom.id}
                                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${
                                        index !== chatRooms.length - 1 ? 'border-b' : ''
                                    }`}
                                    onClick={() => handleChatRoomClick(chatRoom.id, chatRoom.otherUserNickname)}
                                >
                                    <Image
                                        src={chatRoom.otherUserProfileImage || '/busking2.jpg'}
                                        alt={chatRoom.otherUserNickname || 'User'}
                                        className='w-12 h-12 rounded-full'
                                        width={48}
                                        height={48}
                                    />
                                    <div className='ml-4'>
                                        <h3 className='text-lg font-semibold'>
                                            {chatRoom.otherUserNickname || 'User'}
                                        </h3>
                                        <p
                                            className='text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis'
                                            style={{ maxWidth: '7ch' }}
                                        >
                                            {chatRoom.lastMessage || ''}
                                        </p>
                                        <small className='text-gray-400'>{formatTime(chatRoom.lastMessageTime)}</small>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='flex flex-col items-center justify-center h-full'>
                                <FaHandSparkles size={50} className='mb-4 text-purple-500' />
                                <p className='text-gray-500 text-center max-w-md leading-relaxed'>
                                    DM은 친구 및 가족과 연락을 유지하는 데 매우 유용합니다. <br />
                                    또한 사랑하는 사람들이 좋아할 만한 재미있는 콘텐츠를 공유하기에도 좋습니다. 하지만
                                    비즈니스 소유자에게는 마케팅을 위한 도구이기도 합니다.
                                </p>
                            </div>
                        )}
                    </div>
                )}
                {/* 채팅방 표시 */}
                {selectedChatRoom && receiverId && (
                    <div className='flex-1 flex flex-col'>
                        {/* 채팅방 상단 버튼 */}
                        <div className='bg-white border-b border-gray-200 p-2'>
                            <button
                                onClick={handleBackToList}
                                className='flex items-center text-gray-500 hover:text-black'
                            >
                                <IoIosArrowBack size={24} />
                                <span className='ml-2'>{otherUserNickname}</span> {/* 닉네임 표시 */}
                            </button>
                        </div>
                        {/* 채팅 내용 영역 */}
                        <div className='flex-1 overflow-y-auto bg-white'>
                            {selectedChatRoom && receiverId ? (
                                <ChatRoom
                                    key={`${selectedChatRoom}-${receiverId}`}
                                    chatRoomId={selectedChatRoom}
                                    receiverId={receiverId}
                                />
                            ) : (
                                <p>채팅방을 선택하세요.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// 마지막 채팅 보낸 시점 시간 계산
const formatTime = (time: string) => {
    if (!time) return '';

    const diff = Date.now() - new Date(time).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return new Date(time).toLocaleDateString();
};

export default DMPage;
