/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/state/userState';
import { Client, Frame, Message } from '@stomp/stompjs';
import apiClient from '@/api/apiClient';
import SockJS from 'sockjs-client';

interface ChatMessage {
    id: string;
    chatRoomId: string;
    senderId: string;
    receiverId: string;
    content: string;
    sendTime: string;
    otherUserProfileImage: string;
    read: boolean;
    sentByMe: boolean;
}

interface ChatRoomProps {
    chatRoomId: string;
    receiverId: string | null;
}

const ChatRoom = ({ chatRoomId, receiverId }: ChatRoomProps) => {
    const user = useRecoilValue(userState);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const stompClientRef = useRef<Client | null>(null);
    const otherUserProfileImageRef = useRef<string | null>(null);

    useEffect(() => {
        // Fetch chat messages
        const fetchMessages = async () => {
            try {
                const response = await apiClient.get(`/message-room/${chatRoomId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setMessages(response.data);
                if (response.data.length > 0) {
                    const firstMessage = response.data.find((msg: ChatMessage) => !msg.sentByMe);
                    if (firstMessage) {
                        otherUserProfileImageRef.current = firstMessage.otherUserProfileImage;
                    }
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        // Connect to WebSocket
        const socket = new SockJS(`https://5b0b-1-241-95-127.ngrok-free.app/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
        });
        stompClientRef.current = stompClient;

        stompClient.onConnect = (frame: Frame) => {
            console.log('Connected: ' + frame);
            stompClient.subscribe(`/user/queue/messages`, (message: Message) => {
                const parsedMessage: ChatMessage = JSON.parse(message.body);
                if (parsedMessage.chatRoomId === chatRoomId) {
                    setMessages((prevMessages) => [...prevMessages, parsedMessage]);
                }
            });
        };

        stompClient.onStompError = (error: Frame) => {
            console.error('STOMP error:', error);
        };

        stompClient.activate();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [chatRoomId, user.token]);

    const handleSendMessage = async () => {
        if (stompClientRef.current && stompClientRef.current.connected && newMessage.trim()) {
            const message = {
                senderId: user.id,
                receiverId: receiverId,
                content: newMessage,
                chatRoomId: chatRoomId,
            };

            console.log('Sending message:', message);

            stompClientRef.current.publish({
                destination: '/app/chat',
                body: JSON.stringify(message),
            });

            setNewMessage('');

            // 메시지를 보낸 후 다시 메시지 패치
            try {
                const response = await apiClient.get(`/message-room/${chatRoomId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages after sending:', error);
            }
        } else {
            console.log('Message not sent. Either client is not connected or message is empty.');
        }
    };

    return (
        <div className='flex flex-col h-full'>
            <div className='flex-1 p-4 overflow-y-auto'>
                {messages.map((message, index) => (
                    <div key={index} className={`mb-2 flex ${message.sentByMe ? 'justify-end' : 'justify-start'}`}>
                        {!message.sentByMe && (
                            <div className='flex items-center'>
                                <img src={message.otherUserProfileImage} className='w-10 h-10 rounded-full mr-2' />
                                <div className='flex flex-col'>
                                    <div className='p-2 rounded-lg bg-purple-200 text-black'>{message.content}</div>
                                </div>
                            </div>
                        )}
                        {message.sentByMe && (
                            <div className='flex items-end'>
                                <div className='p-2 rounded-lg bg-blue-200 text-black'>{message.content}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className='p-4 border-t border-gray-200 flex'>
                <input
                    type='text'
                    className='flex-1 p-2 border border-gray-300 rounded-lg mr-2'
                    placeholder='Type a message...'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                    className='p-2 bg-purple-400 text-white rounded-lg hover:bg-purple-200 active:bg-purple-700 focus:outline-none'
                    onClick={handleSendMessage}
                >
                    전송
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
