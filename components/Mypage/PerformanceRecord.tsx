'use client';

import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface PerformanceRecordProps {
    onWritePost: () => void;
}

const PerformanceRecord: React.FC<PerformanceRecordProps> = ({ onWritePost }) => {
    return (
        <div>
            <div className="flex justify-end mb-4">
                <button onClick={onWritePost} className="text-purple-500 hover:text-purple-600">
                    <FaPlus />
                </button>
            </div>
            {/* 공연 기록 목록 렌더링 */}
        </div>
    );
};

export default PerformanceRecord;
