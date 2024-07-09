import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/apiClient';
import { FaRegEdit } from 'react-icons/fa';
import { formatDate } from '@/constants/constants';

interface Post {
    id: number;
    title: string;
    content: string;
    likesCount: number;
    savesCount: number;
    author: string;
    viewCount: number;
    timestamp: string;
}

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await apiClient.get('/freeboard');
            setPosts(response.data);
        };

        fetchPosts();
    }, []);

    const onPostClick = (postId: number) => {
        router.push(`/freeboard/${postId}`);
    };

    const onWriteClick = () => {
        router.push(`/freeboard/write`);
    };

    return (
        <div>
            <button className="bg-purple-700 text-white py-2 px-4" onClick={onWriteClick}>
                <FaRegEdit />
            </button>
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
                            <td className="border p-2">{formatDate(post.timestamp)}</td>
                            <td className="border p-2">{post.viewCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PostList;
