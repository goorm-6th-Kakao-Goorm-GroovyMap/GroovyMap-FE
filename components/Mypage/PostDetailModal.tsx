// components/PostDetailModal.tsx
'use client';

import React from 'react';
import { Post, User } from '@/types/types';
import Image from 'next/image';

interface PostDetailModalProps {
    post: Post;
    user: User;
    onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, user, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">{post.userNickname}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>
                {post.image && <Image src={post.image} alt="Post" className="w-full h-60 object-cover mb-4" />}
                <p className="mb-4">{post.text}</p>
                <div>
                    <h3 className="font-bold mb-2">댓글</h3>
                    {post.comments.length > 0 ? (
                        <ul>
                            {post.comments.map((comment) => (
                                <li key={comment.id} className="mb-2">
                                    <div className="flex items-center space-x-2">
                                        <Image
                                            src={comment.userProfileImage}
                                            alt={comment.userNickname}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <p className="font-semibold">{comment.userNickname}</p>
                                    </div>
                                    <p>{comment.text}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>댓글이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetailModal;
