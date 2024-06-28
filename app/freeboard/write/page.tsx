'use client';

import React, { useState } from 'react';
import apiClient from '@/api/apiClient';
import { useRouter } from 'next/navigation';
import ImageUpload from '../ImageUpload';

const WritePostForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const router = useRouter();

    const handleImageUpload = (url: string) => {
        setImageUrls([...imageUrls, url]);
    };

    const handleSubmit = async () => {
        const htmlContent = `
        <h1>${title}</h1>
        ${imageUrls.map((url) => `<img src="${url}" alt="Post Image"/>`).join('')}
        <p>${content}</p>
      `;

        try {
            await apiClient.post('/freeboard/write', {
                title,
                content: htmlContent,
            });
            router.push('/freeboard');
        } catch (error) {
            console.error('Failed to write post:', error);
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
            <ImageUpload onImageUpload={handleImageUpload} />
            <button type="submit" className="w-full bg-purple-700 text-white py-2 px-4 rounded" onClick={handleSubmit}>
                글쓰기
            </button>
        </form>
    );
};

export default WritePostForm;
