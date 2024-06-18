'use client';

import React from 'react';

interface SettingModalProps {
    onClose: () => void;
}

const SettingModal: React.FC<SettingModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">설정</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-2">프로필 사진</label>
                        <input type="file" className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">닉네임</label>
                        <input type="text" className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">자기소개</label>
                        <textarea className="w-full p-2 border rounded-lg" rows={4}></textarea>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg">
                        취소
                    </button>
                    <button className="bg-purple-500 text-white py-2 px-4 rounded-lg">저장</button>
                </div>
            </div>
        </div>
    );
};

export default SettingModal;
