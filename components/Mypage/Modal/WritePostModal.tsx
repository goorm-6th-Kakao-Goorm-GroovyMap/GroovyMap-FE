'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { useParams } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/state/userState';

interface WritePostModalProps {
    onClose: () => void;
}

const WritePostModal: React.FC<WritePostModalProps> = ({ onClose }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const queryClient = useQueryClient();
    const params = useParams();
    const loggedInUser = useRecoilValue(userState);
    const memberId = params.id; // URL에서 사용자 ID를 추출

    const endpoint = memberId ? `/mypage/photo/write/${memberId}` : `/mypage/photo/write`;

    const { mutate, status } = useMutation({
        mutationFn: async (newPost: FormData) => {
            return await apiClient.post(endpoint, newPost, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['posts', memberId || 'loggedInUser'],
            });
            onClose();
        },
        onError: (error) => {
            console.error('Error creating post:', error);
            setErrorMessage('게시물 작성 중 오류가 발생했습니다.');
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (!text) {
            setErrorMessage('텍스트를 입력해주세요.');
            return;
        }
        const formData = new FormData();
        formData.append('text', text);
        if (image) {
            formData.append('image', image);
        }
        mutate(formData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">새 게시물 작성</h2>
                {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                    rows={4}
                    placeholder="글을 작성하세요..."
                ></textarea>
                <input type="file" onChange={handleImageChange} className="mb-4" />
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg">
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-purple-500 text-white py-2 px-4 rounded-lg"
                        disabled={status === 'pending'}
                    >
                        {status === 'pending' ? '등록 중...' : '등록'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WritePostModal;
