/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { Post, User } from '@/types/types';

interface PostDetailModalProps {
    post: Post;
    user: User;
    onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, user, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex items-center mb-4">
                    <img src={user.profileImage} alt={user.nickname} className="w-10 h-10 rounded-full mr-4" />
                    <p className="font-semibold">{user.nickname}</p>
                </div>
                {post.image && <img src={post.image} alt="Post" className="w-full h-64 object-cover mb-4" />}
                <p className="text-lg mb-4">{post.text}</p>
                <div className="flex items-center mb-4">
                    <button className="text-red-500 flex items-center">
                        <FaHeart size={20} className="mr-2" /> 좋아요
                    </button>
                </div>
                <div className="space-y-4">
                    {post.comments.map((comment) => (
                        <div key={comment.id} className="border-t pt-2 flex items-start">
                            <img
                                src={comment.userProfileImage}
                                alt={comment.userNickname}
                                className="w-8 h-8 rounded-full mr-2"
                            />
                            <div>
                                <p className="font-semibold">{comment.userNickname}</p>
                                <p>{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="bg-purple-500 text-white py-2 px-4 rounded-lg">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostDetailModal;
