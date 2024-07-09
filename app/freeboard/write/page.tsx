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
import { DateTime } from 'luxon';

Quill.register('modules/imageUploader', ImageUploader);

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const WritePostForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const currentUser = useRecoilValue(userState);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', currentUser.nickname);
        formData.append('content', content);
        formData.append('savesCount', '0');
        formData.append('likesCount', '0');
        formData.append('viewCount', '0');
        formData.append('timestamp', new Date().toISOString());

        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const imgTags = doc.querySelectorAll('img');

        imgTags.forEach((imgTag, index) => {
            fetch(imgTag.src)
                .then((res) => res.blob())
                .then((blob) => {
                    const file = new File([blob], `image${index}.png`, { type: blob.type });
                    formData.append(`fileNames`, file);
                });
        });

        try {
            const response = await apiClient.post('/freeboard/write', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newPostId = response.data.id;
            router.push(`/freeboard/${newPostId}`);
        } catch (error) {
            console.log(error);
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
