'use client';

import React, { useEffect, useState } from 'react';
import { fieldTranslations, partTranslations, regionCenters } from '../types';
import { DateTime } from 'luxon';
import { useParams, useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/state/userState';
import apiClient from '@/api/apiClient';
import { formatDate } from '@/constants/constants';

interface Comment {
    id: number;
    author: string;
    content: string;
    date: string;
    timestamp: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    region: string;
    field: string;
    part: string;
    recruitNum: number;
    viewCount: number;
    timeStamp: string;
}

const PostContent: React.FC = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentContent, setCommentContent] = useState('');
    const router = useRouter();
    const { postId } = useParams<{ postId: string }>();
    const currentUser = useRecoilValue(userState);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await apiClient.get(`/recruitboard/${postId}`);
                console.log('Fetched post:', response.data);
                setPost(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await apiClient.get(`/recruitboard/${postId}/comment`);
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
                await apiClient.delete(`/recruitboard/${post.id}`);
                router.push('/recruitboard');
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleAddComment = async () => {
        const now = DateTime.local().toISO();
        if (post) {
            try {
                await apiClient.post(`/recruitboard/${post.id}/comment`, {
                    postId,
                    commentAuthor: currentUser.nickname,
                    content: commentContent,
                    now,
                });
                setCommentContent('');
                const response = await apiClient.get(`/recruitboard/${postId}/comment`);
                setComments(response.data);
            } catch (error) {
                console.log(error);
            }
        }
    };

    if (!post) return <div>Loading...</div>;

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <button onClick={() => router.push('/recruitboard')} className="bg-gray-200 py-2 px-4 rounded mb-4">
                &lt; 뒤로가기
            </button>
            {currentUser.nickname === post.author && (
                <div className="flex space-x-4 mb-4">
                    <button onClick={handleDeletePost} className="flex items-center text-red-500 hover:text-red-700">
                        삭제
                    </button>
                </div>
            )}
            <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
            <div className="flex items-center mb-4 text-sm text-gray-600">
                <p className="mr-4">
                    작성자: {post.author} | 작성일: {formatDate(post.timeStamp)} | 조회수: {post.viewCount}
                </p>
            </div>
            <div className="mb-4">
                <p className="mb-2 text-gray-600">
                    모집장소: {regionCenters[post.region].name} | 모집분야: {fieldTranslations[post.field]} | 모집파트:{' '}
                    {partTranslations[post.part]} | 모집인원: {post.recruitNum}
                </p>
                <p className="text-lg mb-4">{post.content}</p>
            </div>
            <h3 className="text-2xl font-bold border-t pt-4 mb-4">댓글</h3>
            <div className="comments">
                {comments.map((comment) => (
                    <div key={comment.id} className="border-b py-2">
                        <p className="font-semibold">{comment.author}</p>
                        <p className="text-sm text-gray-600 mb-2">{comment.content}</p>
                        <p className="text-xs text-gray-400">{formatDate(comment.timestamp)}</p>
                    </div>
                ))}
            </div>
            <div className="mb-4">
                <textarea
                    className="border w-full p-2"
                    rows={4}
                    placeholder="댓글을 입력하세요"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                ></textarea>
                <button
                    className="bg-purple-700 text-white py-2 px-4 mt-2 hover:bg-purple-800 rounded"
                    onClick={handleAddComment}
                >
                    댓글 작성
                </button>
            </div>
        </div>
    );
};

export default PostContent;
