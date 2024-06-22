'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { areas, parts, types } from '@/constants/constants';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { toast } from 'react-toastify';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { myPageUserState, userState, LoginUser } from '@/recoil/state/userState';
import { User } from '@/types/types';

interface SettingModalProps {
    onClose: () => void;
    onProfileUpdate: () => void;
}

const SettingModal: React.FC<SettingModalProps> = ({ onClose, onProfileUpdate }) => {
    const [myPageUser, setMyPageUser] = useRecoilState(myPageUserState);
    const resetUserState = useResetRecoilState(myPageUserState);
    const [currentUser, setCurrentUser] = useRecoilState(userState);
    const [formData, setFormData] = useState({
        profileImage: null as File | null,
        nickname: myPageUser.nickname || '',
        region: myPageUser.region || 'ALL',
        part: myPageUser.part || 'ALL',
        type: myPageUser.type || '',
        introduction: myPageUser.introduction || '',
    });
    const [filteredTypes, setFilteredTypes] = useState<string[]>([]);

    useEffect(() => {
        if (formData.part && parts[formData.part].types) {
            setFilteredTypes(parts[formData.part].types || []);
        } else {
            setFilteredTypes([]);
        }
    }, [formData.part]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
                profileImage: files[0],
            }));
        }
    };

    const updateMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await apiClient.patch('/member/update', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: (data) => {
            setMyPageUser(data);
            // 현재 로그인된 유저 상태도 업데이트
            setCurrentUser((prevUser: LoginUser) => ({
                ...prevUser,
                profileUrl: data.profileImage, // 프로필 이미지 업데이트
                nickname: data.nickname, // 닉네임 업데이트
            }));
            toast.success('프로필이 성공적으로 업데이트되었습니다.');
            onProfileUpdate();
            onClose();
        },
        onError: (error) => {
            toast.error('프로필 업데이트 중 오류가 발생했습니다.');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            await apiClient.delete('/member/delete', { withCredentials: true });
        },
        onSuccess: () => {
            toast.success('회원 탈퇴가 완료되었습니다.');
            resetUserState();
            onClose();
        },
        onError: (error) => {
            toast.error('회원 탈퇴 중 오류가 발생했습니다.');
        },
    });

    const handleSubmit = () => {
        const data = new FormData();
        data.append('nickname', formData.nickname);
        data.append('region', formData.region);
        data.append('part', formData.part);
        data.append('type', formData.type);
        data.append('introduction', formData.introduction);
        if (formData.profileImage) {
            data.append('profileImage', formData.profileImage);
        }
        updateMutation.mutate(data);
    };

    const handleDeleteAccount = () => {
        if (confirm('정말로 탈퇴하시겠습니까?')) {
            deleteMutation.mutate();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">설정</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-2">프로필 사진</label>
                        <input
                            type="file"
                            name="profileImage"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">닉네임</label>
                        <input
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">활동 지역</label>
                        <select
                            name="region"
                            value={formData.region}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg"
                        >
                            {Object.keys(areas).map((key) => (
                                <option key={key} value={key}>
                                    {areas[key].name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">분야/파트</label>
                        <select
                            name="part"
                            value={formData.part}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg"
                        >
                            {Object.keys(parts).map((key) => (
                                <option key={key} value={key}>
                                    {parts[key].name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {filteredTypes.length > 0 && (
                        <div>
                            <label className="block font-semibold mb-2">세부 파트</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="">세부 파트를 선택하세요</option>
                                {filteredTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {types[type].name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block font-semibold mb-2">자기소개</label>
                        <textarea
                            name="introduction"
                            value={formData.introduction}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg"
                            rows={4}
                        ></textarea>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg">
                        취소
                    </button>
                    <button onClick={handleSubmit} className="bg-purple-500 text-white py-2 px-4 rounded-lg">
                        저장
                    </button>
                    <button onClick={handleDeleteAccount} className="bg-red-500 text-white py-2 px-4 rounded-lg">
                        회원 탈퇴
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingModal;
