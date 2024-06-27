import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Post, Comment } from './types';
import apiClient from '@/api/apiClient';

const PostPage: React.FC = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentContent, setCommentContent] = useState('');
    const router = useRouter();
    const { postId } = router.query;

    useEffect(() => {
        const fetchPost = async () => {
            const response = await apiClient.get(`/freeboard/posts/${postId}`);
            setPost(response.data);
        };

        const fetchComments = async () => {
            const response = await apiClient.get(`/freeboard/posts/${postId}/comments`);
            setComments(response.data);
        };

        if (postId) {
            fetchPost();
            fetchComments();
        }
    }, [postId]);

    const handleAddComment = async () => {
        try {
            await apiClient.post(`/freeboard/posts/${postId}/comments`, { content: commentContent });
            setCommentContent('');
            const response = await apiClient.get(`/freeboard/posts/${postId}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    if (!post) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            <p>{post.content}</p>
            {post.image && <img src={post.image} alt="Post image" className="mt-4" />}
            <div className="flex justify-between items-center mt-4">
                <button onClick={() => apiClient.post(`/api/freeboard/posts/${postId}/like`)}>
                    좋아요 {post.likes}
                </button>
                <button onClick={() => apiClient.post(`/api/freeboard/posts/${postId}/bookmark`)}>
                    북마크 {post.bookmarks}
                </button>
            </div>
            <h3 className="text-xl font-bold border-t mt-4">댓글</h3>
            <div className="mb-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-t py-2">
                        <p className="font-bold">{comment.author}</p>
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>
            <div className="mb-4">
                <textarea
                    className="border p-2 w-full"
                    placeholder="댓글을 입력하세요"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                ></textarea>
                <button className="bg-purple-700 text-white py-2 px-4 mt-2" onClick={handleAddComment}>
                    댓글 작성
                </button>
            </div>
        </div>
    );
};

export default PostPage;
