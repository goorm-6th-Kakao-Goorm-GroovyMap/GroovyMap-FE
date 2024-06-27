'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Post } from './types';
import apiClient from '@/api/apiClient';
import PostList from './postlist';

const FreeBoard: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await apiClient.get('/freeboard/posts');
            setPosts(response.data);
        };

        fetchPosts();
    }, []);

    return (
        <main className="main-container flex min-h-screen flex-col items-center p-6">
            <div className="content flex-1 w-full max-w-4xl">
                {/* 검색창 */}
                <div className="flex justify-center items-center mb-6">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            className="w-full border rounded p-2 pl-10"
                            placeholder="검색어를 입력하세요..."
                        />
                        <div className="absolute left-3 top-3 text-gray-400"></div>
                    </div>
                </div>
                {/* 메뉴이름*/}
                <header className="header mb-6">
                    <h1 className="text-2xl font-bold text-purple-700">자유게시판</h1>
                </header>
                <PostList posts={posts} />
            </div>
        </main>
    );
};

export default FreeBoard;
