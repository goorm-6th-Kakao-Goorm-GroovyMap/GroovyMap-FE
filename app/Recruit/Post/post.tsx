'use client';

import React, { useState } from 'react';
import type { Comment, Post } from '../types';

interface PostProps {
    post: Post;
    comments: Comment[];
    addComment: (postId: number, author: string, content: string) => void;
    goBack: () => void;
}

const PostContent: React.FC<PostProps> = ({ post, comments, addComment, goBack }) => {
    const [commentContent, setCommentContent] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');

    const handleAddComment = () => {
        addComment(post.id, commentAuthor, commentContent);
        setCommentAuthor('');
        setCommentContent('');
    };

    return (
        <div className="border p-4">
            <button onClick={goBack} className="bg-gray-200 p-2 rounded mb-4">
                뒤로가기
            </button>
            <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
            <p className="mb-2">
                작성자: {post.author} 작성일: {post.date.toFormat('yyyy-MM-dd HH:mm:ss')} 조회수: {post.views}
            </p>
            <p className="mb-2">
                모집장소: {post.region} 모집분야: {post.position} 모집인원: {post.recruit_num}
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
                <input
                    type="text"
                    className="border p-2 w-full mb-2"
                    placeholder="작성자"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                />
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

export default PostContent;
