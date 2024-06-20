'use client';

import React, { useState } from 'react';
import { regionCenters, type Comment, type Post } from '../../types';
import { DateTime } from 'luxon';

interface PostProps {
    post: Post;
    comments: Comment[];
    addComment: (postId: number, authorId: number, content: string, date: string) => void;
    goBack: () => void;
    authorId: number;
}

const PostContent: React.FC<PostProps> = ({ post, comments, addComment, goBack, authorId }) => {
    const [commentContent, setCommentContent] = useState('');

    const handleAddComment = async () => {
        try {
            const now = DateTime.local().toISO();
            console.log('post.id:', post.id);
            console.log('authorId:', authorId);
            addComment(post.id, authorId, commentContent, now);
            setCommentContent('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    return (
        <div className="border p-4">
            <button onClick={goBack} className="bg-gray-200 p-2 rounded mb-4">
                뒤로가기
            </button>
            <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
            <p className="mb-2">
                작성자: {post.author} 조회수: {post.viewCount}
            </p>
            <p className="mb-2">
                모집장소: {regionCenters[post.region].name} 모집분야: {post.field} 모집파트: {post.part} 모집인원:{' '}
                {post.recruitNum}
            </p>
            <p className="mb-4">{post.content}</p>
            <h3 className="text-xl font-bold border-t mb-2">댓글</h3>
            <div className="mb-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-t py-2">
                        <p className="font-bold ">닉네임: {comment.author}</p>
                        <p>내용: {comment.content}</p>
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
            {/* 댓글 목록 렌더링 */}
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

export default PostContent;
