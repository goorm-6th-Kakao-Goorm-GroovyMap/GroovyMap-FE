'use client';

import React, { useEffect, useMemo, useState } from 'react';
import apiClient from '@/api/apiClient';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/state/userState';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const WritePostForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const currentUser = useRecoilValue(userState);
    const router = useRouter();
    const { postId } = useParams<{ postId: string }>();
    const isEditing = Boolean(postId);

    useEffect(() => {
        if (isEditing) {
            const fetchPost = async () => {
                try {
                    const response = await apiClient.get(`/freeboard/${postId}`);
                    setTitle(response.data.title);
                    setContent(response.data.content);
                } catch (error) {
                    console.log(error);
                }
            };

            fetchPost();
        }
    }, [isEditing, postId]);

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
        const parseContent = async () => {
            if (typeof window !== 'undefined') {
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/html');
                const imgTags = doc.querySelectorAll('img');

                const imageUploadPromises = Array.from(imgTags).map(async (imgTag, index) => {
                    const res = await fetch(imgTag.src);
                    const blob = await res.blob();
                    const file = new File([blob], `image${index}.png`, { type: blob.type });
                    formData.append(`fileNames`, file);
                });

                await Promise.all(imageUploadPromises);
            }

            try {
                if (isEditing) {
                    await apiClient.put(`/freeboard/${postId}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                } else {
                    const response = await apiClient.post('/freeboard/write', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    const newPostId = response.data.id;
                    router.push(`/freeboard/${newPostId}`);
                }
            } catch (error) {
                console.log(error);
            }
        };

        parseContent();
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
        <div className="flex justify-center min-h-screen bg-purple-50 p-6">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="mb-6">
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
                    <div className="mb-6">
                        <label htmlFor="content" className="block font-bold mb-1">
                            내용:
                        </label>
                        <div className="relative">
                            <ReactQuill
                                value={content}
                                onChange={setContent}
                                modules={modules}
                                formats={formats}
                                style={{ height: '400px', marginBottom: '2rem' }}
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-purple-700 text-white py-2 px-4 rounded">
                        {isEditing ? '수정하기' : '글쓰기'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WritePostForm;
