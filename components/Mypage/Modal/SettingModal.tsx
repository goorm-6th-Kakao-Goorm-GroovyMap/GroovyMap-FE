// components/SettingModal.tsx
'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { areas, parts, types } from '@/constants/constants'; // types도 추가
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { toast } from 'react-toastify';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { userState } from '@/recoil/state/userState';

interface SettingModalProps {
    onClose: () => void;
}

const SettingModal: React.FC<SettingModalProps> = ({ onClose }) => {
    const [user, setUser] = useRecoilState(userState);
    const resetUserState = useResetRecoilState(userState); // Recoil 상태 초기화 함수
    const [formData, setFormData] = useState({
        profileImage: '',
        nickname: user.nickname || '',
        region: user.region || 'ALL',
        part: user.part || 'ALL',
        type: '', // 새로운 필드 추가
        introduction: user.introduction || '',
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

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await apiClient.patch('/member/update', data);
            return response.data;
        },
        onSuccess: (data) => {
            setUser(data);
            toast.success('프로필이 성공적으로 업데이트되었습니다.');
            onClose();
        },
        onError: (error) => {
            toast.error('프로필 업데이트 중 오류가 발생했습니다.');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            await apiClient.delete('/member/delete');
        },
        onSuccess: () => {
            toast.success('회원 탈퇴가 완료되었습니다.');
            resetUserState(); // Recoil 상태 초기화
            onClose();
        },
        onError: (error) => {
            toast.error('회원 탈퇴 중 오류가 발생했습니다.');
        },
    });

    const handleSubmit = () => {
        updateMutation.mutate(formData);
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
                            onChange={handleInputChange}
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
                                        {types[type].name} {/* types[type].name 으로 변경 */}
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
