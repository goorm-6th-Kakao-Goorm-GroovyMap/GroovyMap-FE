'use client';

import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { useParams } from 'next/navigation';
import PerformanceWritePostModal from './Modal/PerformanceWritePostModal.tsx';
import { Map, MapMarker, MapTypeControl, ZoomControl } from 'react-kakao-maps-sdk';
import { areas } from '@/constants/constants';
import { User } from '@/types/types';

interface PerformanceRecordProps {
    isOwner: boolean;
    user: User;
}

const PerformanceRecord: React.FC<PerformanceRecordProps> = ({ user, isOwner }) => {
    const [isWritePostOpen, setWritePostOpen] = useState(false); // 글쓰기 모달 상태
    const { id } = useParams(); // URL에서 사용자 ID를 추출

    const endpoint = isOwner ? `/mypage/performance` : `/mypage/performance/${user?.id}`;

    const {
        data: records,
        error,
        isLoading,
    } = useQuery<any[]>({
        queryKey: ['performanceRecords', id],
        queryFn: async () => {
            const response = await apiClient.get(endpoint);
            return response.data;
        },
        enabled: !!id || isOwner, // id가 있거나 isOwner일 때만 쿼리 실행
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        console.error('Error fetching performance records:', error);
        return <div>Error loading performance records</div>;
    }

    return (
        <div>
            {isOwner && (
                <div className="flex justify-end mb-4">
                    <button onClick={() => setWritePostOpen(true)} className="text-purple-500 hover:text-purple-600">
                        <FaPlus />
                    </button>
                </div>
            )}
            <div className="relative mb-4">
                <Map center={{ lat: 37.5665, lng: 126.978 }} style={{ width: '100%', height: '400px' }} level={5}>
                    {records &&
                        records.length > 0 &&
                        records.map(
                            (record) =>
                                record.latitude &&
                                record.longitude && (
                                    <MapMarker
                                        key={record.id}
                                        position={{ lat: record.latitude, lng: record.longitude }}
                                        title={record.description}
                                    />
                                )
                        )}
                    <MapTypeControl position="TOPRIGHT" />
                    <ZoomControl position="RIGHT" />
                </Map>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {records && records.length > 0 ? (
                    records.map((record) => (
                        <div key={record.id} className="border p-4 rounded">
                            <p>{record.description}</p>
                            <p>장소: {record.address}</p>
                            <p>날짜: {record.date}</p>
                            <p>지역: {areas[record.region]?.name}</p>
                        </div>
                    ))
                ) : (
                    <div>No performance records available.</div>
                )}
            </div>
            {isWritePostOpen && <PerformanceWritePostModal onClose={() => setWritePostOpen(false)} />}
        </div>
    );
};

export default PerformanceRecord;
