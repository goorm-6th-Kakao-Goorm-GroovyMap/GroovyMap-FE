'use client';

import React from 'react';

interface WritePostModalProps {
    onClose: () => void;
}

const WritePostModal: React.FC<WritePostModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">글쓰기</h2>
                <textarea
                    className="w-full p-2 border rounded-lg mb-4"
                    rows={4}
                    placeholder="글을 작성하세요..."
                ></textarea>
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg">
                        취소
                    </button>
                    <button className="bg-purple-500 text-white py-2 px-4 rounded-lg">등록</button>
                </div>
            </div>
        </div>
    );
};

export default WritePostModal;
