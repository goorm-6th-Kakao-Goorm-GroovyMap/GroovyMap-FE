import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiClient from '@/api/apiClient';

interface ChatRoom {
    id: number;
    name: string;
}

const DmPage: React.FC = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const router = useRouter();
    const userId = 1; // 현재 로그인한 사용자 ID, 실제 구현에서는 동적 값 사용

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const response = await apiClient.get(`/chatrooms/${userId}`);
                setChatRooms(response.data);
            } catch (error) {
                console.error('Failed to fetch chat rooms:', error);
            }
        };

        fetchChatRooms();
    }, [userId]);

    const handleRoomSelect = (roomId: number) => {
        router.push(`/dm/chatroom/${roomId}`);
    };

    return (
        <div>
            <h1>Direct Messages</h1>
            <ul>
                {chatRooms.map((room) => (
                    <li key={room.id} onClick={() => handleRoomSelect(room.id)}>
                        {room.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DmPage;
