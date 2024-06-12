'use client';
import React from 'react';
import type { Post } from './types';

interface PostListProps {
    posts: Post[];
    onPostClick: (postId: number) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onPostClick }) => {
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
                        <td className="border p-2">{post.date.toFormat('yyyy-MM-dd HH:mm:ss')}</td>
                        <td className="border p-2">{post.viewCount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PostList;
