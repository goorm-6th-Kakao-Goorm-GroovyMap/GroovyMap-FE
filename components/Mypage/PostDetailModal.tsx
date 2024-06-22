'use client';

import React, { useRef } from 'react';
import { Post, User } from '@/types/types';
import Image from 'next/image';

interface PostDetailModalProps {
    post: Post;
    user: User;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, user, onClose, onNext, onPrev, hasNext, hasPrev }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleClickOutside}
        >
            <div ref={modalRef} className="relative bg-white p-4 rounded-lg shadow-lg w-full max-w-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    ✕
                </button>
                {post.image && (
                    <div className="relative w-full h-96 mb-4">
                        <Image src={post.image} alt="Post" layout="fill" objectFit="cover" className="rounded-lg" />
                    </div>
                )}
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">
                        <div className="flex items-center mb-4">
                            <Image
                                src={post.userProfileImage}
                                alt={post.userNickname}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full mr-2"
                            />
                            <h2 className="text-xl font-bold">{post.userNickname}</h2>
                        </div>
                    </h2>
                    <p className="mb-4">{post.text}</p>
                    <div>
                        <h3 className="font-bold mb-2">댓글</h3>
                        {post.comments && post.comments.length > 0 ? (
                            <ul>
                                {post.comments.map((comment) => (
                                    <li key={comment.id} className="mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Image
                                                src={comment.userProfileImage}
                                                alt={comment.userNickname}
                                                width={32}
                                                height={32}
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
                {hasPrev && (
                    <button
                        onClick={onPrev}
                        className="absolute left-[-10px] top-1/2 transform -translate-y-1/2 bg-purple-500 text-white p-2 rounded-full shadow-md w-12 h-12 flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-chevron-left"
                        >
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                )}
                {hasNext && (
                    <button
                        onClick={onNext}
                        className="absolute right-[-10px] top-1/2 transform -translate-y-1/2 bg-purple-500 text-white p-2 rounded-full shadow-md w-12 h-12 flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-chevron-right"
                        >
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default PostDetailModal;
