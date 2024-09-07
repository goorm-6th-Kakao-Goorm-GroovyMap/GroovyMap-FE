'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/api/apiClient';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/state/userState';
import { DateTime } from 'luxon';
import { formatDate } from '@/constants/constants';
import { FcLike, FcBookmark } from 'react-icons/fc';
import { FaRegBookmark, FaRegHeart } from 'react-icons/fa';
interface Comment {
    id: number;
    author: string;
    content: string;
    timestamp: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    likesCount: number;
    savesCount: number;
    viewCount: number;
    timestamp: string;
}

const PostPage: React.FC = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentContent, setCommentContent] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const router = useRouter();
    const { postId } = useParams<{ postId: string }>();
    const currentUser = useRecoilValue(userState);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await apiClient.get(`/freeboard/${postId}`);
                setPost(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await apiClient.get(`/freeboard/${postId}/comment`);
                setComments(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        if (postId) {
            fetchPost();
            fetchComments();
        }
    }, [postId]);

    const handleDeletePost = async () => {
        if (post) {
            try {
                await apiClient.delete(`/freeboard/${post.id}`);
                router.push('/freeboard');
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleCommentSubmit = async () => {
        const now = DateTime.local().toISO();
        if (post) {
            try {
                await apiClient.post(`/freeboard/${post.id}/comment`, {
                    postId,
                    commentAuthor: currentUser.nickname,
                    content: commentContent,
                    now,
                });
                setCommentContent('');
                const response = await apiClient.get(`/freeboard/${postId}/comment`);
                setComments(response.data);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleLikePost = async () => {
        if (post) {
            try {
                await apiClient.post(`/freeboard/${post.id}/like`);
                setIsLiked(!isLiked);
                const response = await apiClient.get(`/freeboard/${post.id}`);
                setPost(response.data);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleSavePost = async () => {
        if (post) {
            try {
                await apiClient.post(`/freeboard/${post.id}/save`);
                setIsBookmarked(!isBookmarked);
                const response = await apiClient.get(`/freeboard/${post.id}`);
                setPost(response.data);
            } catch (error) {
                console.log(error);
            }
        }
    };

    if (!post) return <div>Loading...</div>;

    return (
        <div className="flex justify-center min-h-screen bg-purple-50 p-6">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
                <button onClick={() => router.push('/freeboard')} className="bg-gray-200 py-2 px-4 rounded mb-4">
                    &lt; 뒤로가기
                </button>
                {currentUser.nickname === post.author && (
                    <div className="flex space-x-4 mb-4">
                        <button
                            onClick={handleDeletePost}
                            className="flex items-center text-red-500 hover:text-red-700"
                        >
                            삭제
                        </button>
                        <button
                            onClick={() => router.push(`/freeboard/write?postId=${post?.id}`)}
                            className="flex items-center text-blue-500 hover:text-blue-700"
                        >
                            수정
                        </button>
                    </div>
                )}
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center mb-4 text-sm text-gray-600">
                    <p className="mr-4">
                        작성자: {post.author} | 작성일: {formatDate(post.timestamp)} | 조회수: {post.viewCount}
                    </p>
                </div>
                <div className="prose mb-4" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                <div className="flex items-center border-b space-x-4 mb-4">
                    <button onClick={handleLikePost} className="flex items-center text-gray-600 hover:text-purple-700">
                        {isLiked ? <FcLike /> : <FaRegHeart />} {post.likesCount}
                    </button>
                    <button onClick={handleSavePost} className="flex items-center text-gray-600 hover:text-purple-700">
                        {isBookmarked ? <FcBookmark /> : <FaRegBookmark />} {post.savesCount}
                    </button>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-2">댓글</h2>
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="border-b pb-4">
                                <p className="font-semibold">{comment.author}</p>
                                <p>{comment.content}</p>
                                <p className="text-gray-500 text-sm">{formatDate(comment.timestamp)}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-6">
                    <textarea
                        className="w-full border rounded p-2 mb-4"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="댓글을 입력하세요."
                    />
                    <button onClick={handleCommentSubmit} className="w-full bg-purple-700 text-white py-2 px-4 rounded">
                        댓글 달기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostPage;
