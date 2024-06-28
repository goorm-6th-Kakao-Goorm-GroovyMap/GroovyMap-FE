'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Post, User } from '@/types/types';
import Image from 'next/image';
import { FaHeart, FaTimes } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { toast } from 'react-toastify';

interface PostDetailModalProps {
    postId: string;
    currentUser?: User; // 현재 로그인한 사용자 정보
    user: User; // 마이페이지의 주인 정보
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({
    postId,
    user,
    currentUser,
    onClose,
    onNext,
    onPrev,
    hasNext,
    hasPrev,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const [comment, setComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    const handleClickOutside = (event: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    const {
        data: post,
        error,
        refetch,
    } = useQuery<Post>({
        queryKey: ['postDetail', postId],
        queryFn: async () => {
            const response = await apiClient.get(`/mypage/photo/${user.nickname}/${postId}`);
            return response.data;
        },
        enabled: !!postId,
    });

    useEffect(() => {
        if (post) {
            refetch();
        }
    }, [post, refetch]);

    const likeMutation = useMutation({
        mutationFn: async () => {
            const response = await apiClient.post(`/mypage/photo/${postId}/like`, { withCredentials: true });
            return response.data;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['postDetail', postId] });
            const previousPost = queryClient.getQueryData<Post>(['postDetail', postId]);

            if (previousPost) {
                queryClient.setQueryData<Post>(['postDetail', postId], {
                    ...previousPost,
                    likes: previousPost.isLiked ? previousPost.likes - 1 : previousPost.likes + 1,
                    isLiked: !previousPost.isLiked,
                });
            }

            return { previousPost };
        },
        onError: (err, _, context) => {
            if (context?.previousPost) {
                queryClient.setQueryData<Post>(['postDetail', postId], context.previousPost);
            }
            toast.error('좋아요 중 오류가 발생했습니다.');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['postDetail', postId] });
        },
    });

    const handleLikeClick = () => {
        likeMutation.mutate();
    };

    const commentMutation = useMutation({
        mutationFn: async (newComment: string) => {
            const response = await apiClient.post(
                `/mypage/photo/${postId}/comments`,
                { text: newComment },
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: () => {
            setComment('');
            refetch();
            toast.success('댓글이 성공적으로 등록되었습니다.');
        },
        onError: () => {
            toast.error('댓글 등록 중 오류가 발생했습니다.');
        },
    });

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error('댓글을 입력해주세요.');
            return;
        }
        commentMutation.mutate(comment);
    };

    const deleteCommentMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await apiClient.delete(`/mypage/photo/${postId}/comments/${id}`, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            refetch();
            toast.success('댓글이 성공적으로 삭제되었습니다.');
        },
        onError: () => {
            toast.error('댓글 삭제 중 오류가 발생했습니다.');
        },
    });

    const handleCommentDelete = (id: string) => {
        deleteCommentMutation.mutate(id);
    };

    if (!post) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>게시물을 불러오는 중 오류가 발생했습니다.</div>;
    }

    //유저 프로필 이미지 가져오기
    const getProfileImageUrl = (userProfileUrl: string | undefined) => {
        if (!userProfileUrl) return '';
        if (typeof userProfileUrl === 'string' && userProfileUrl.startsWith('http')) return userProfileUrl;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:8080';
        return `${backendUrl}${userProfileUrl}`;
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleClickOutside}
        >
            <div ref={modalRef} className="relative bg-white p-4 rounded-lg shadow-lg w-full max-w-2xl">
                {post.image && (
                    <div className="relative w-full h-96 mb-4">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${post.image}`}
                            alt="Post"
                            fill
                            style={{ objectFit: 'contain' }}
                            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="rounded-lg"
                        />
                        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                            <button
                                onClick={handleLikeClick}
                                className={`bg-white p-1 rounded-full hover:bg-gray-200 transition-colors ${
                                    isLiked ? 'text-red-600' : 'text-gray-400'
                                }`}
                            >
                                <FaHeart />
                            </button>
                            <span className="text-gray-700">{likes}</span>
                        </div>
                    </div>
                )}
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">
                        <div className="relative flex items-center mb-4">
                            <Image
                                src={getProfileImageUrl(user.profileImage)}
                                alt={user.nickname}
                                width={32}
                                height={32}
                                priority
                                style={{ objectFit: 'cover' }}
                                className="w-8 h-8 rounded-full mr-2"
                            />
                            <h2 className="text-xl font-bold">{user.nickname}</h2>
                        </div>
                    </h2>
                    <p className="mb-4">{post.text}</p>

                    <div className="">
                        <h3 className="font-bold mb-2">댓글</h3>
                        {post.comments && post.comments.length > 0 ? (
                            <ul>
                                {post.comments.map((comment) => (
                                    <li key={comment.id} className="mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Image
                                                src={getProfileImageUrl(comment.userProfileImage)}
                                                alt={comment.userNickname}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm">
                                                    <span className="font-semibold">{comment.userNickname}</span>{' '}
                                                    {comment.text}
                                                </p>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {comment.userNickname === currentUser?.nickname && (
                                                <button
                                                    onClick={() => handleCommentDelete(comment.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTimes />
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>댓글이 없습니다.</p>
                        )}
                    </div>
                    <form onSubmit={handleCommentSubmit} className="mt-4 justify-right">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="댓글을 입력하세요..."
                            className="w-full p-2 border rounded mb-2"
                        />
                        <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">
                            댓글 등록
                        </button>
                    </form>
                </div>
                {hasPrev && (
                    <button
                        onClick={onPrev}
                        className="absolute left-[-10px] top-1/2 transform -translate-y-1/2 bg-purple-500 text-white p-2 rounded-full shadow-md w-12 h-12 flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-chevron-left"
                        >
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                )}
                {hasNext && (
                    <button
                        onClick={onNext}
                        className="absolute right-[-10px] top-1/2 transform -translate-y-1/2 bg-purple-500 text-white p-2 rounded-full shadow-md w-12 h-12 flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-chevron-right"
                        >
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default PostDetailModal;
