import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import apiClient from '@/api/apiClient';

interface ChatMessage {
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
}

const ChatRoomPage: React.FC = () => {
    const router = useRouter();
    const { chatroomId } = router.query;
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const userId = 1;
    const stompClient = useRef<Client | null>(null);

    useEffect(() => {
        if (!chatroomId) return;

        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
        });

        stompClient.current.onConnect = () => {
            if (stompClient.current) {
                stompClient.current.subscribe(`/${chatroomId}`, (msg: IMessage) => {
                    if (msg.body) {
                        const receivedMessage: ChatMessage = JSON.parse(msg.body);
                        setChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
                    }
                });
            }
        };

        stompClient.current.activate();

        const fetchMessages = async () => {
            try {
                const response = await apiClient.get<ChatMessage[]>(`/messages/${chatroomId}`);
                setChatMessages(response.data);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };

        fetchMessages();

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [chatroomId]);

    const sendMessage = () => {
        if (stompClient.current && message.trim()) {
            const chatMessage: ChatMessage = {
                senderId: userId,
                receiverId: 0, // 임시값, 실제 구현 시 수정 필요
                content: message,
                timestamp: new Date().toISOString(),
            };
            stompClient.current.publish({
                destination: `/app/chat.send/${chatroomId}`,
                body: JSON.stringify(chatMessage),
            });
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Chat Room: {chatroomId}</h2>
            <div>
                {chatMessages.map((msg, index) => (
                    <div key={index}>
                        <p>
                            <strong>{msg.senderId === userId ? 'Me' : 'Other'}:</strong> {msg.content}
                        </p>
                    </div>
                ))}
            </div>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatRoomPage;
