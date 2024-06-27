import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiClient from '@/api/apiClient';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/state/userState';

interface Comment {
    id: number;
    author: string;
    content: string;
}

interface Post {
    id: number;
    title: string;
    content: string; // HTML content
    author: string;
    likes: number;
}

const PostPage: React.FC = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentContent, setCommentContent] = useState('');
    const router = useRouter();
    const { postId } = router.query;
    const currentUser = useRecoilValue(userState);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await apiClient.get(`/freeboard/${postId}`);
                setPost(response.data);
            } catch (error) {
                console.error('Failed to fetch post:', error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await apiClient.get(`/freeboard/${postId}/comment`);
                setComments(response.data);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };

        if (postId) {
            fetchPost();
            fetchComments();
        }
    }, [postId]);

    const handleDeleteClick = async () => {
        if (post) {
            try {
                await apiClient.delete(`/freeboard/${post.id}`);
                router.push('/freeboard');
            } catch (error) {
                console.error('Failed to delete post:', error);
            }
        }
    };

    const handleEditClick = () => {
        if (post) {
            router.push(`/freeboard/edit/${post.id}`);
        }
    };

    const handleCommentSubmit = async () => {
        if (post) {
            try {
                await apiClient.post(`/freeboard/${post.id}/comment`, {
                    author: currentUser.nickname,
                    content: commentContent,
                });
                setCommentContent('');
                const response = await apiClient.get(`/freeboard/${postId}/comment`);
                setComments(response.data);
            } catch (error) {
                console.error('Failed to submit comment:', error);
            }
        }
    };

    const handleLikeClick = async () => {
        if (post) {
            try {
                await apiClient.post(`/freeboard/${post.id}/like`);
                const response = await apiClient.get(`/freeboard/${post.id}`);
                setPost(response.data);
            } catch (error) {
                console.error('Failed to like post:', error);
            }
        }
    };

    if (!post) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <button onClick={() => router.push('/freeboard')} className="bg-gray-200 p-2 rounded mb-4">
                뒤로가기
            </button>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            {currentUser.nickname === post.author && (
                <div className="flex space-x-4">
                    <button onClick={handleEditClick} className="flex items-center">
                        수정
                    </button>
                    <button onClick={handleDeleteClick} className="flex items-center">
                        삭제
                    </button>
                </div>
            )}
            <button onClick={handleLikeClick} className="flex items-center">
                {post.likes}
            </button>
            <div>
                <textarea
                    className="border p-2 w-full"
                    placeholder="댓글을 입력하세요"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                ></textarea>
                <button onClick={handleCommentSubmit} className="bg-purple-700 text-white py-2 px-4 mt-2">
                    댓글 작성
                </button>
            </div>
            <div className="comments">
                {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                        <p>{comment.content}</p>
                        <p>{comment.author}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostPage;
