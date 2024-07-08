'use client';
import apiClient from '@/api/apiClient';
import { DateTime } from 'luxon';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Post {
    id: number;
    title: string;
    author: string;
    content: string;
    field: string;
    part: string;
    region: string;
    recruitNum: number;
    date: DateTime;
    viewCount: number;
}

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await apiClient.get('/recruitboard');
            setPosts(response.data);
        };

        fetchPosts();
    }, []);

    const onPostClick = (postId: number) => {
        router.push(`/recruitboard/${postId}`);
    };
    return (
        <table className="w-full border-collapse border">
            <thead>
                <tr>
                    <th className="border p-2">제목</th>
                    <th className="border p-2">글쓴이</th>
                    <th className="border p-2">작성일</th>
                    <th className="border p-2">조회수</th>
                </tr>
            </thead>
            <tbody>
                {posts.map((post) => (
                    <tr key={post.id} onClick={() => onPostClick(post.id)} className="cursor-pointer">
                        <td className="border p-2">{post.title}</td>
                        <td className="border p-2">{post.author}</td>
                        <td className="border p-2">작성일</td>
                        <td className="border p-2">{post.viewCount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PostList;
