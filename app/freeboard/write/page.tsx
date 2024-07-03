'use client';

import React, { useMemo, useState } from 'react';
import apiClient from '@/api/apiClient';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Quill } from 'react-quill';
import ImageUploader from 'quill-image-uploader';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/state/userState';

Quill.register('modules/imageUploader', ImageUploader);

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const WritePostForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [likesCount, setLikesCount] = useState('');
    const [savesCount, setSavesCount] = useState('');
    const [viewCount, setViewCount] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [content, setContent] = useState('');
    const currentUser = useRecoilValue(userState);
    const router = useRouter();

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('fileNames', file);
        try {
            const response = await apiClient.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.url;
        } catch (error) {
            console.error('Image upload failed:', error);
            throw error;
        }
    };

    const modules = useMemo(
        () => ({
            toolbar: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image', 'video'],
                ['clean'],
            ],
            imageUploader: {
                upload: handleImageUpload,
            },
        }),
        []
    );

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'link',
        'image',
        'video',
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', currentUser.nickname);
        formData.append('content', content);
        formData.append('likesCount', likesCount);
        formData.append('savesCount', savesCount);
        formData.append('viewCount', viewCount);
        formData.append('timestamp', timestamp);

        try {
            const response = await apiClient.post('/freeboard/write', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newPostId = response.data.id;
            router.push(`/freeboard/${newPostId}`);
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
                <ReactQuill value={content} onChange={setContent} modules={modules} formats={formats} />
            </div>
            <button type="submit" className="w-full bg-purple-700 text-white py-2 px-4 rounded">
                글쓰기
            </button>
        </form>
    );
};

export default WritePostForm;
