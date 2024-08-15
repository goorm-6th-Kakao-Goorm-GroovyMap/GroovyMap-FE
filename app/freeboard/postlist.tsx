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

interface PostListProps {
    searchWord: string;
}

const PostList: React.FC<PostListProps> = ({ searchWord }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const postsPerPage = 15;

    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await apiClient.get('/freeboard');
            setPosts(response.data);
        };

        fetchPosts();
    }, []);

    const filteredPosts = posts.filter((post) => post.title.toLowerCase().includes(searchWord.toLowerCase()));

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const onPostClick = (postId: number) => {
        router.push(`/freeboard/${postId}`);
    };

    const onWriteClick = () => {
        router.push(`/freeboard/write`);
    };

    const onPageClick = (page: number) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * postsPerPage;
    const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button className="bg-purple-700 text-white py-2 px-4" onClick={onWriteClick}>
                    <FaRegEdit />
                </button>
            </div>
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
                            <td className="border p-2">{formatDate(post.timestamp)}</td>
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
