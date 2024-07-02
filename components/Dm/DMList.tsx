'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoMdSearch } from 'react-icons/io';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/state/userState';
import apiClient from '@/api/apiClient';

interface DM {
    id: number;
    myId: number;
    myNickname: string;
    otherUserId: number;
    otherUserNickname: string;
    otherUserProfileImage: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
}

const DMList = () => {
    const currentUser = useRecoilValue(userState); // userState 가져오기
    const [dmList, setDmList] = useState<DM[]>([]); // DM 목록

    useEffect(() => {
        if (currentUser.nickname) {
            apiClient
                .get('/message-room', { withCredentials: true })
                .then((response) => setDmList(response.data))
                .catch((error) => console.error('Error fetching DM list:', error));
        }
    }, [currentUser.nickname]);

    if (!currentUser.nickname) return <div>Loading...</div>;

    return (
        <div className='content p-6 bg-purple-50 min-h-screen'>
            <div className='content flex-1 w-full max-w-4xl mx-auto'>
                <div className='flex justify-center items-center mb-6'>
                    <div className='relative w-full'>
                        <input
                            type='text'
                            className='w-full border rounded p-2 pl-10'
                            placeholder='검색어를 입력하세요...'
                        />
                        <div className='absolute left-3 top-3 text-gray-400'>
                            <IoMdSearch size={20} />
                        </div>
                    </div>
                </div>
                <h1>{currentUser.nickname} DM List</h1>
                <ul>
                    {dmList.map((dm) => (
                        <li key={dm.id} className='flex items-center mb-4'>
                            <Link
                                href={`/dm/${currentUser.nickname}/${dm.otherUserNickname}`}
                                className='flex items-center'
                            >
                                <Image
                                    src={dm.otherUserProfileImage}
                                    alt={dm.otherUserNickname}
                                    width={50}
                                    height={50}
                                    className='rounded-full'
                                />
                                <div className='ml-4'>
                                    <div className='font-bold'>{dm.otherUserNickname}</div>
                                    <div className='text-gray-600'>{dm.lastMessage}</div>
                                    <div className='text-sm text-gray-400'>Unread: {dm.unreadCount}</div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DMList;
