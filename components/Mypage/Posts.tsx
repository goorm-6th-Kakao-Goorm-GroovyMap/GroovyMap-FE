'use client';

import React, { useState } from 'react';
import { FaPen } from 'react-icons/fa';
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
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isWritePostOpen, setWritePostOpen] = useState(false);

    const fetchPosts = async (): Promise<Post[]> => {
        const response = await apiClient.get(`/mypage/photo/${user.nickname}`);
        return response.data;
    };

    const {
        data: posts,
        isLoading,
        isError,
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

    const handlePostClick = async (post: Post) => {
        const response = await apiClient.get(`/mypage/photo/${user.nickname}/${post.id}`);
        setSelectedPost(response.data);
    };

    return (
        <div>
            {isOwner && (
                <div className="flex justify-end mb-4">
                    <button onClick={() => setWritePostOpen(true)} className="text-purple-500 hover:text-purple-600">
                        <FaPen size={18} />
                    </button>
                </div>
            )}
            <div className="grid grid-cols-1 gap-4">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="border p-4 rounded cursor-pointer"
                            onClick={() => handlePostClick(post)}
                        >
                            {post.image && (
                                <Image
                                    src={post.image}
                                    alt="Post Image"
                                    width={500}
                                    height={300}
                                    className="w-full h-auto mb-4 rounded-lg"
                                />
                            )}
                            <p>{post.text}</p>
                            <div className="mt-2 text-gray-600">
                                <span>작성자: {post.userNickname}</span>
                                <div className="flex items-center mt-2">
                                    <Image
                                        src={post.userProfileImage}
                                        alt="작성자 프로필"
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <span>{post.userNickname}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>게시물이 없습니다.</p>
                )}
            </div>
            {isWritePostOpen && <WritePostModal onClose={() => setWritePostOpen(false)} />}
            {selectedPost && <PostDetailModal post={selectedPost} user={user} onClose={() => setSelectedPost(null)} />}
        </div>
    );
};

export default Posts;
