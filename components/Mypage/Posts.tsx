'use client';

import React, { useState } from 'react';
import { FaPen } from 'react-icons/fa';
import PostDetailModal from './PostDetailModal';
import WritePostModal from './Modal/WritePostModal';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { User } from '@/types';

interface Comment {
    id: number;
    text: string;
}

interface Post {
    id: number;
    text: string;
    image?: string;
    comments: { id: number; text: string }[];
    userNickname: string; // userNickname 속성 추가
}

interface PostsProps {
    isOwner: boolean;
    user: User;
    onWritePost: () => void;
}

const Posts: React.FC<PostsProps> = ({ isOwner, user, onWritePost }) => {
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isWritePostOpen, setWritePostOpen] = useState(false);

    const {
        data: posts,
        error,
        isLoading,
    } = useQuery<Post[]>({
        queryKey: ['posts', user?.id],
        queryFn: async () => {
            // 로그인한 사용자가 자신의 마이페이지를 볼 때
            const endpoint = isOwner ? '/mypage/posts' : `/mypage/posts/${user?.id}`;
            const response = await apiClient.get(endpoint);
            return response.data;
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        console.error('Error fetching posts:', error);
        return <div>Error loading posts</div>;
    }

    if (!posts || posts.length === 0) {
        return <div>No posts available</div>; // posts가 없을 경우 처리
    }

    const handlePostClick = (post: Post) => {
        setSelectedPost(post);
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
            <div className="grid grid-cols-3 gap-4">
                {posts.map((post) => (
                    <div key={post.id} className="border rounded cursor-pointer" onClick={() => handlePostClick(post)}>
                        {post.image && <img src={post.image} alt="Post" className="w-full h-60 object-cover" />}
                    </div>
                ))}
            </div>
            {isWritePostOpen && <WritePostModal onClose={() => setWritePostOpen(false)} />}
            {selectedPost && <PostDetailModal post={selectedPost} user={user} onClose={() => setSelectedPost(null)} />}
        </div>
    );
};

export default Posts;
