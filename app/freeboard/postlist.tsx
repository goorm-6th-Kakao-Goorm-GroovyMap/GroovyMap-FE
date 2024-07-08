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

    const onPostClick = (postId: number) => {
        router.push(`/freeboard/${postId}`);
    };

    return (
        <div>
            <button onClick={() => router.push('/freeboard/write')}>글쓰기</button>
            <div>
                {posts.map((post) => (
                    <div key={post.id} onClick={() => onPostClick(post.id)}>
                        <h2>{post.title}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;
