'use client';

import React, { useState } from 'react';
import { regionCenters, type Comment, type Post } from '../../types';
import { DateTime } from 'luxon';

interface PostProps {
    post: Post;
    comments: Comment[];
    addComment: (postId: number, authorId: string, content: string, date: string) => void;
    goBack: () => void;
    authorId: number;
}

const PostContent: React.FC<PostProps> = ({ post, comments, addComment, goBack, authorId }) => {
    const [commentContent, setCommentContent] = useState('');

    const handleAddComment = async () => {
        try {
            const now = DateTime.local().toISO();
            addComment(post.id, authorId.toString(), commentContent, now);
            setCommentContent('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
            <button onClick={goBack} className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded mb-4">
                &lt; 뒤로가기
            </button>
            <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
            <div className="flex items-center mb-4 text-sm text-gray-600">
                <p className="mr-4">작성자: {post.author}</p>
                <p className="mr-4">조회수: {post.viewCount}</p>
                {/* <p>작성일: {DateTime.fromISO(post.date).toLocaleString(DateTime.DATE_SHORT)}</p> */}
            </div>
            <div className="mb-4">
                <p className="mb-2">
                    모집장소: {regionCenters[post.region].name} / 모집분야: {post.field} / 모집파트: {post.part} /
                    모집인원: {post.recruitNum}
                </p>
                <p className="text-lg mb-4">{post.content}</p>
            </div>
            <h3 className="text-2xl font-bold border-t pt-4 mb-4">댓글</h3>
            <div className="mb-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="border-b py-2">
                        <p className="font-bold mb-1">{comment.author}</p>
                        <p className="text-sm">{comment.content}</p>
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
