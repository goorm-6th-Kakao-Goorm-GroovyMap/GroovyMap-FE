'use client';

import { formatDate } from '@/constants/constants';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface Post {
    id: number;
    title: string;
    author: string;
    content: string;
    field: string;
    part: string;
    region: string;
    recruitNum: number;
    timeStamp: string;
    viewCount: number;
}
interface PostListProps {
    posts: Post[];
}
const PostList: React.FC<PostListProps> = ({ posts }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const postsPerPage = 15;
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const router = useRouter();

    const onPostClick = (postId: number) => {
        router.push(`/recruitboard/${postId}`);
    };

    const onPageClick = (page: number) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * postsPerPage;
    const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

    return (
        <div>
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
                    {currentPosts.map((post) => (
                        <tr key={post.id} onClick={() => onPostClick(post.id)} className="cursor-pointer">
                            <td className="border p-2">{post.title}</td>
                            <td className="border p-2">{post.author}</td>
                            <td className="border p-2">{formatDate(post.timeStamp)}</td>
                            <td className="border p-2">{post.viewCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                        key={page}
                        className={`mx-2 px-3 py-1 ${page === currentPage ? 'bg-purple-700 text-white' : 'bg-gray-300 text-black'}`}
                        onClick={() => onPageClick(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PostList;
