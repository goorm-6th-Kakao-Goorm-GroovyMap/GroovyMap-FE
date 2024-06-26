'use client';

import React, { useState } from 'react';
import apiClient from '@/api/apiClient';
import { Post } from './types';

interface WritePostFormProps {
    postId: string;
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    updatePostList: () => void;
    toggleWriting: () => void;
}

const WritePostForm: React.FC<WritePostFormProps> = ({ postId, setPosts, updatePostList, toggleWriting }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('timestamp', new Date().toISOString());
        formData.append('viewCount', '0');

        try {
            const response = await apiClient.post(`/freeboard/write`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'ngrok-skip-browser-warning': '69420',
                },
            });

            if (response.status === 201) {
                const newPost = response.data;
                setPosts((prev) => [...prev, newPost]);
                setTitle('');
                setContent('');

                updatePostList();
                toggleWriting();
            } else {
                console.error('error', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border p-4">
            <div className="mb-4">
                <label htmlFor="title" className="block font-bold mb-1">
                    제목:
                </label>
                <input
                    type="text"
                    id="title"
                    className="w-full border rounded p-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요."
                />
            </div>
            <div className="mb-4">
                <label htmlFor="content" className="block font-bold mb-1">
                    내용:
                </label>
                <textarea
                    id="content"
                    className="w-full border rounded p-2"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요."
                />
            </div>
            <button type="submit" className="w-full bg-purple-700 text-white py-2 px-4 rounded">
                글쓰기
            </button>
        </form>
    );
};

export default WritePostForm;
