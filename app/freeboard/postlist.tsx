import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/apiClient';

interface Post {
    id: number;
    title: string;
    content: string;
    likesCount: number;
    savesCount: number;
    author: string;
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

    const handlePostClick = (postId: number) => {
        router.push(`/freeboard/${postId}`);
    };

    return (
        <div>
            <button onClick={() => router.push('/freeboard/write')}>글쓰기</button>
            <div>
                {posts.map((post) => (
                    <div key={post.id} onClick={() => handlePostClick(post.id)}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <p>Likes: {post.likesCount}</p>
                        <p>Saves: {post.savesCount}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;
