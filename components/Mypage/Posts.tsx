'use client';

import React, { useState } from 'react';
import { FaCamera, FaTimes, FaHeart } from 'react-icons/fa';
import PostDetailModal from './PostDetailModal';
import WritePostModal from './Modal/WritePostModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { User, Post } from '@/types/types';
import Image from 'next/image';
import SkeletonLoader from '@/components/SkeletonLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PostsProps {
    isOwner: boolean;
    user: User;
    onWritePost: () => void;
}

const Posts: React.FC<PostsProps> = ({ isOwner, user, onWritePost }) => {
    const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);
    const [isWritePostOpen, setWritePostOpen] = useState(false);
    const queryClient = useQueryClient();

    const fetchPosts = async (): Promise<Post[]> => {
        const response = await apiClient.get(`/mypage/photo/${user.nickname}`);
        return response.data;
    };

    const {
        data: posts = [], // 기본값을 빈 배열로 설정
        isLoading,
        isError,
        refetch, // refetch 추가
    } = useQuery<Post[]>({
        queryKey: ['posts', user.nickname],
        queryFn: fetchPosts,
        enabled: !!user.nickname,
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/mypage/photo/${id}`);
        },
        onSuccess: () => {
            refetch();
            toast.success('게시물이 성공적으로 삭제되었습니다.');
        },
        onError: () => {
            toast.error('게시물 삭제 중 오류가 발생했습니다.');
        },
    });

    const likeMutation = useMutation({
        mutationFn: async (postId: string) => {
            const response = await apiClient.post(`/mypage/photo/${postId}/like`);
            return response.data;
        },
        onMutate: async (postId: string) => {
            await queryClient.cancelQueries({ queryKey: ['posts', user.nickname] });
            const previousPosts = queryClient.getQueryData<Post[]>(['posts', user.nickname]);

            if (previousPosts) {
                queryClient.setQueryData<Post[]>(['posts', user.nickname], (oldPosts) =>
                    oldPosts?.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post))
                );
            }

            return { previousPosts };
        },
        onError: (err, postId, context) => {
            if (context?.previousPosts) {
                queryClient.setQueryData<Post[]>(['posts', user.nickname], context.previousPosts);
            }
            toast.error('좋아요 중 오류가 발생했습니다.');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['posts', user.nickname] });
        },
    });

    const handleLikeClick = (postId: string) => {
        likeMutation.mutate(postId);
    };

    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (isError || !Array.isArray(posts)) {
        return <p>게시물을 불러오는 데 실패했습니다.</p>;
    }

    const handlePostClick = (index: number) => {
        setSelectedPostIndex(index);
    };

    const handleNextPost = () => {
        if (selectedPostIndex !== null && selectedPostIndex < posts.length - 1) {
            setSelectedPostIndex(selectedPostIndex + 1);
        }
    };

    const handlePrevPost = () => {
        if (selectedPostIndex !== null && selectedPostIndex > 0) {
            setSelectedPostIndex(selectedPostIndex - 1);
        }
    };

    const handlePostCreated = () => {
        refetch();
    };

    const handleDelete = (id: string) => {
        toast(
            <div className="flex flex-col items-center justify-center">
                <p>게시물을 삭제하시겠습니까?</p>
                <div className="flex justify-around mt-2 mr-3">
                    <button
                        onClick={() => {
                            deleteMutation.mutate(id);
                            toast.dismiss();
                        }}
                        className="bg-purple-500 text-white px-4 mr-3 py-1 rounded"
                    >
                        예
                    </button>
                    <button onClick={() => toast.dismiss()} className="bg-gray-300 px-3 py-1 rounded">
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

    return (
        <div className="p-4">
            <ToastContainer position="top-center" limit={1} />
            {isOwner && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setWritePostOpen(true)}
                        className="flex items-center text-purple-500 hover:text-purple-600"
                    >
                        <FaCamera className="mr-2" size={18} />
                        <span>게시물 올리기</span>
                    </button>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post, index) => (
                    <div key={post.id} className="relative cursor-pointer" onClick={() => handlePostClick(index)}>
                        {post.image && (
                            <div className="w-full h-0" style={{ paddingBottom: '100%' }}>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${post.image}`}
                                    alt="Post Image"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg"
                                />
                            </div>
                        )}
                        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLikeClick(post.id);
                                }}
                                className="bg-white text-red-500 p-1 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <FaHeart />
                            </button>
                            <span className="text-white">{post.likes}</span>
                        </div>
                        {isOwner && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(post.id);
                                }}
                                className="absolute top-2 right-2 bg-gray-300 text-gray-700 p-1 rounded-full hover:bg-purple-500 hover:text-white transition-colors"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {isWritePostOpen && (
                <WritePostModal onClose={() => setWritePostOpen(false)} onPostCreated={handlePostCreated} />
            )}
            {selectedPostIndex !== null && (
                <PostDetailModal
                    post={posts[selectedPostIndex]}
                    user={user}
                    onClose={() => setSelectedPostIndex(null)}
                    onNext={handleNextPost}
                    onPrev={handlePrevPost}
                    hasNext={selectedPostIndex < posts.length - 1}
                    hasPrev={selectedPostIndex > 0}
                />
            )}
        </div>
    );
};

export default Posts;
