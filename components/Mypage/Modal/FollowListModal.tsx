'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { useRouter } from 'next/navigation';
import { User } from '@/types/types';
import Image from 'next/image';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FollowListModalProps {
    nickname: string;
    type: 'followers' | 'following';
    onClose: () => void;
}

const FollowListModal: React.FC<FollowListModalProps> = ({ nickname, type, onClose }) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const fetchFollowList = async (): Promise<User[]> => {
        const response = await apiClient.get(`/mypage/${nickname}/${type}`);
        return response.data;
    };

    const {
        data: users,
        isLoading,
        isError,
    } = useQuery<User[]>({
        queryKey: [type, nickname],
        queryFn: fetchFollowList,
        enabled: !!nickname,
    });

    // 언팔로우 로직
    const deleteFollowMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await apiClient.delete(`/mypage/unfollow/${id}`, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [type, nickname] });
            toast.success('팔로우가 성공적으로 삭제되었습니다.');
        },
        onError: () => {
            toast.error('팔로우 삭제 중 오류가 발생했습니다.');
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !users) {
        return <div>Error loading {type} list.</div>;
    }

    const handleDeleteClick = (id: string) => {
        toast(
            <div className="flex flex-col items-center justify-center">
                <p>정말로 팔로우를 삭제하시겠습니까?</p>
                <div className="flex justify-around mt-2 mr-3">
                    <button
                        onClick={() => {
                            deleteFollowMutation.mutate(id);
                            toast.dismiss();
                        }}
                        className="bg-red-500 text-white px-4 py-1 rounded"
                    >
                        예
                    </button>
                    <button onClick={() => toast.dismiss()} className="bg-gray-300 ml-2 px-3 py-1 rounded">
                        아니오
                    </button>
                </div>
            </div>,
            {
                closeButton: false,
                autoClose: false,
            }
        );
    };

    // 프로필 이미지 띄워줄때 URL 받아온거 => 절대 경로로 변환
    const getProfileImageUrl = (profileImage?: string) => {
        if (!profileImage) {
            return '';
        }
        if (profileImage.startsWith('http')) {
            return profileImage;
        }
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:8080';
        return `${backendUrl}${profileImage}`;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{type === 'followers' ? '팔로워' : '팔로잉'}</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user.id} className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                {user.profileImage ? (
                                    <Image
                                        src={getProfileImageUrl(user.profileImage)}
                                        alt={`${user.nickname}'s profile image`}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full mr-2"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-purple-700 text-white flex items-center justify-center rounded-full mr-2">
                                        <span className="text-xl">
                                            {user.nickname ? user.nickname.charAt(0).toUpperCase() : ''}
                                        </span>
                                    </div>
                                )}
                                <span
                                    className="cursor-pointer"
                                    onClick={() => router.push(`/mypage/${user.nickname}`)}
                                >
                                    {user.nickname}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={() => router.push(`/dm/${user.nickname}`)}
                                    className="bg-purple-500 text-white px-2 py-2 rounded-lg mr-2"
                                >
                                    <FaPaperPlane size={14} />
                                </button>
                                {type === 'following' && (
                                    <button
                                        onClick={() => handleDeleteClick(user.id)}
                                        className="bg-gray-200 text-gray-500 px-2 py-2 rounded-lg"
                                    >
                                        <FaTimes size={16} />
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FollowListModal;
