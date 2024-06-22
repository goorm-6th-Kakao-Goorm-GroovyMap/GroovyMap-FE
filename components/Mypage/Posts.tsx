// components/Posts.tsx
'use client';

import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import PostDetailModal from './PostDetailModal';
import WritePostModal from './Modal/WritePostModal';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { User, Post } from '@/types/types';
import Image from 'next/image';
import SkeletonLoader from '@/components/SkeletonLoader';

interface PostsProps {
    isOwner: boolean;
    user: User;
    onWritePost: () => void;
}

const Posts: React.FC<PostsProps> = ({ isOwner, user, onWritePost }) => {
    const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);
    const [isWritePostOpen, setWritePostOpen] = useState(false);

    const fetchPosts = async (): Promise<Post[]> => {
        const response = await apiClient.get(`/mypage/photo/${user.nickname}`);
        return response.data;
    };

    const {
        data: posts,
        isLoading,
        isError,
        refetch, // refetch 추가
    } = useQuery<Post[]>({
        queryKey: ['posts', user.nickname],
        queryFn: fetchPosts,
        enabled: !!user.nickname,
    });

    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (isError || !posts) {
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

    return (
        <div className="p-4">
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
            <div className="grid grid-cols-3 gap-4">
                {posts.map((post, index) => (
                    <div key={post.id} className="relative cursor-pointer" onClick={() => handlePostClick(index)}>
                        {post.image && (
                            <div className="w-full h-0" style={{ paddingBottom: '100%' }}>
                                <Image
                                    src={post.image}
                                    alt="Post Image"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg"
                                />
                            </div>
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
