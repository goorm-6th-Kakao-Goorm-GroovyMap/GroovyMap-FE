'use client';

import React from 'react';
import { FaPen } from 'react-icons/fa';

interface PostsProps {
    onWritePost: () => void;
}

const Posts: React.FC<PostsProps> = ({ onWritePost }) => {
    return (
        <div>
            <div className="flex justify-end mb-4">
                <button onClick={onWritePost} className="text-purple-500 hover:text-purple-600">
                    <FaPen size={18} />
                </button>
            </div>
            {/* 게시물 목록 렌더링 */}
        </div>
    );
};

export default Posts;
