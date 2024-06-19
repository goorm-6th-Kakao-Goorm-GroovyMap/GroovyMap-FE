'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { useRouter, useParams } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/state/userState';

interface WritePostModalProps {
    onClose: () => void;
}

const WritePostModal: React.FC<WritePostModalProps> = ({ onClose }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const queryClient = useQueryClient();
    const params = useParams();
    const loggedInUser = useRecoilValue(userState);
    const memberId = params?.id; // URL에서 사용자 ID를 추출
    const isOwner = !memberId || loggedInUser?.id === memberId; // 로그인한 사용자가 자신의 마이페이지를 보는지 확인

    const mutation = useMutation({
        mutationFn: async (newPost: FormData) => {
            const endpoint = isOwner ? `/mypage/photo/write` : `/mypage/photo/write/${memberId}`;
            return await apiClient.post(endpoint, newPost, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['posts', memberId]);
            onClose();
        },
        onError: (error) => {
            console.error('Error creating post:', error);
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('text', text);
        if (image) {
            formData.append('image', image);
        }
        formData.append('userNickname', loggedInUser.nickname); // 사용자 닉네임 추가
        mutation.mutate(formData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">새 게시물 작성</h2>
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
                        disabled={mutation.isLoading}
                    >
                        {mutation.isLoading ? '등록 중...' : '등록'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WritePostModal;
