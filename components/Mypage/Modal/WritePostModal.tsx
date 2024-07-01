'use client';

import React, { useState, ChangeEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/state/userState';

interface WritePostModalProps {
    onClose: () => void;
    onPostCreated: () => void;
}

const WritePostModal: React.FC<WritePostModalProps> = ({ onClose, onPostCreated }) => {
    const user = useRecoilValue(userState); // Recoil을 사용해 로그인된 사용자 정보 가져오기
    const [formData, setFormData] = useState({
        text: '',
        image: null as File | null,
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFormData((prevState) => ({
                ...prevState,
                image: files[0],
            }));
        }
    };

    const mutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await apiClient.post('/mypage/photo/write', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success('게시물이 성공적으로 작성되었습니다.');
            onPostCreated(); // 게시물 작성 성공 시 호출
            onClose();
        },
        onError: () => {
            toast.error('게시물 작성 중 오류가 발생했습니다.');
        },
    });

    const handleSubmit = () => {
        const data = new FormData();
        data.append('text', formData.text);
        // data.append('userNickname', user.nickname); // 닉네임 추가
        if (formData.image) {
            data.append('image', formData.image);
        }
        mutation.mutate(data);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">게시물 작성</h2>
                <textarea
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg mb-4"
                    placeholder="내용을 입력하세요"
                />
                <input type="file" name="Image" onChange={handleFileChange} className="w-full mb-4" />
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg">
                        취소
                    </button>
                    <button onClick={handleSubmit} className="bg-purple-500 text-white py-2 px-4 rounded-lg">
                        작성
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WritePostModal;
