/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/state/userState';
import { Client, Frame, Message as StompMessage } from '@stomp/stompjs';
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
    receiverId: string;
}

const ChatRoom = ({ chatRoomId, receiverId }: ChatRoomProps) => {
    const user = useRecoilValue(userState);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const stompClientRef = useRef<Client | null>(null);
    const messageEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await apiClient.get(`/message-room/${chatRoomId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        const socket = new SockJS(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {},
            onConnect: (frame: Frame) => {
                stompClient.subscribe(`/user/queue/messages`, (message: StompMessage) => {
                    const parsedMessage: ChatMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages, parsedMessage];
                        return updatedMessages;
                    });
                });
            },
            onStompError: (frame: Frame) => {
                console.error('STOMP error:', frame);
            },
            onWebSocketClose: (event) => {
                console.log('WebSocket closed:', event);
            },
            onWebSocketError: (error) => {
                console.error('WebSocket error:', error);
            },
        });
        stompClientRef.current = stompClient;

        stompClient.activate();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [chatRoomId, user.token]);

    const handleSendMessage = async () => {
        if (stompClientRef.current && stompClientRef.current.connected && newMessage.trim() && receiverId) {
            const message = {
                id: '',
                senderId: user.id,
                receiverId: receiverId,
                content: newMessage,
                chatRoomId: chatRoomId,
                sendTime: new Date().toISOString(),
                otherUserProfileImage: user.profileUrl,
                read: false,
                sentByMe: true,
            };

            console.log('Sending message:', message);

            stompClientRef.current.publish({
                destination: '/app/chat',
                body: JSON.stringify(message),
            });

            setNewMessage('');
        } else {
            console.log('Message not sent. Either client is not connected, message is empty, or receiverId is null.');
        }
    };

    // 마지막 대화내용으로 이동
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className='flex flex-col h-full'>
            <div className='flex-1 p-4 overflow-y-auto'>
                {messages.map((message, index) => (
                    <div key={index} className={`mb-2 flex ${message.sentByMe ? 'justify-end' : 'justify-start'}`}>
                        {!message.sentByMe && (
                            <div className='flex items-center'>
                                {!message.read && <div className='bg-red-500 w-2 h-2 rounded-full mr-2' />}
                                <img src={message.otherUserProfileImage} className='w-10 h-10 rounded-full mr-2' />
                                <div className='flex flex-col'>
                                    <div className='p-2 rounded-lg bg-purple-200 text-black'>{message.content}</div>
                                </div>
                            </div>
                        )}
                        {message.sentByMe && (
                            <div className='flex items-end'>
                                <div className='p-2 rounded-lg bg-blue-200 text-black'>{message.content}</div>
                                {/* <img src={user.profileUrl} className="w-10 h-10 rounded-full ml-2" /> */}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messageEndRef} />
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
                    className='p-2 bg-purple-400 text-white rounded-lg hover:bg-purple-200 active:bg-purple-700 focus:outline-none w-auto'
                    onClick={handleSendMessage}
                >
                    전송
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
