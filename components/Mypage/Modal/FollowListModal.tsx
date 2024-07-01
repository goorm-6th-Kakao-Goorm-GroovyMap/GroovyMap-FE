'use client';

import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { useRouter } from 'next/navigation';
import { User } from '@/types/types';
import Image from 'next/image';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRecoilState } from 'recoil';
import { myPageUserState } from '@/recoil/state/userState';

//팔로잉 팔로워 업데이트 바로되게 수정(완료)
//Warning: ReactDOM.preload(): Expected two arguments, a non-empty `href` string and an `options` object with an `as` property valid for a `<link rel="preload" as="..." />` tag. The `href` argument encountered was an empty string.    at ImagePreload (
//마이페이지 화면 뜰때 set toggle 수정 => toast id 설정
//warn-once.ts:6 Image with src "https://6c73-180-66-235-215.ngrok-free.app/images/electric-guitar.png" has "fill" but is missing "sizes" prop. Please add it to improve page performance. Read more: https://nextjs.org/docs/api-reference/next/image#sizes

interface FollowListModalProps {
    nickname: string;
    type: 'followers' | 'following';
    onClose: () => void;
    updateFollowingCounts: (delta: number) => void; // 팔로잉 숫자를 업데이트하는 함수
}

const FollowListModal: React.FC<FollowListModalProps> = ({ nickname, type, onClose, updateFollowingCounts }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [myPageUser, setMyPageUser] = useRecoilState(myPageUserState);

    const fetchFollowList = async (): Promise<User[]> => {
        const response = await apiClient.get(`/mypage/${nickname}/${type}`);
        return response.data;
    };

    const {
        refetch,
        data: users,
        isLoading,
        isError,
    } = useQuery<User[]>({
        queryKey: [type, nickname],
        queryFn: fetchFollowList,
        enabled: !!nickname,
    });

    useEffect(() => {
        if (users) {
            setMyPageUser((prevState) => ({
                ...prevState,
                followList: users,
            }));
        }
    }, [users, setMyPageUser]);

    // 언팔로우 로직
    const deleteFollowMutation = useMutation({
        mutationFn: async (nickname: string) => {
            const response = await apiClient.delete(`/mypage/unfollow/${nickname}`, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [type, nickname] });
            if (type === 'following') {
                updateFollowingCounts(-1);
            }
            refetch();
            if (!toast.isActive('unfollowSuccess')) {
                // toastId를 사용하여 중복 방지
                toast.success('팔로우가 성공적으로 삭제되었습니다.', { toastId: 'unfollowSuccess' });
            }
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

    const handleDeleteClick = (nickname: string) => {
        toast(
            <div className="flex flex-col items-center justify-center">
                <p>정말로 팔로우를 삭제하시겠습니까?</p>
                <div className="flex justify-around mt-2 mr-3">
                    <button
                        onClick={() => {
                            deleteFollowMutation.mutate(nickname);
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
                                        onClick={() => handleDeleteClick(user.nickname)}
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
