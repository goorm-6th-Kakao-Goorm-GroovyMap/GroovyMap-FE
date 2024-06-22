'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { useParams } from 'next/navigation';
import PerformanceWritePostModal from './Modal/PerformanceWritePostModal.tsx';
import { areas } from '@/constants/constants';
import type { User, PerformanceRecord, Place } from '@/types/types';
import Map from '@/components/Places/Map';
import { updateMarkers } from '@/components/Places/UpdataMarkers';

interface PerformanceRecordProps {
    isOwner: boolean;
    user: User;
}

interface KakaoMap {
    clear(): void;
    addMarkers(markers: any[]): void;
}

const PerformanceRecord: React.FC<PerformanceRecordProps> = ({ user, isOwner }) => {
    const { nickname } = useParams<{ nickname: string }>();
    const [isWritePostOpen, setWritePostOpen] = useState(false);
    const [map, setMap] = useState<kakao.maps.Map | null>(null);
    const [clusterer, setClusterer] = useState<KakaoMap | null>(null);
    const [records, setRecords] = useState<PerformanceRecord[]>([]);
    const [markers, setMarkers] = useState<any[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const endpoint = `/mypage/performance/${nickname}`;

    const { data, error, isLoading, refetch } = useQuery<PerformanceRecord[]>({
        queryKey: ['performanceRecords', nickname],
        queryFn: async () => {
            const response = await apiClient.get(endpoint);
            return response.data;
        },
        enabled: !!nickname,
    });

    useEffect(() => {
        if (data) {
            console.log('공연기록 데이터:', data);
            setRecords(data);
        }
    }, [data]);

    useEffect(() => {
        if (map && clusterer && records) {
            const places = records.map<Place>((record) => ({
                id: record.id, // id를 그대로 사용
                name: record.description,
                part: record.part as 'BAND' | 'DANCE' | 'VOCAL',
                type: record.type,
                coordinate: { latitude: record.latitude, longitude: record.longitude },
                region: record.region,
                address: record.address,
            }));
            updateMarkers({
                places,
                map,
                clusterer,
                setMarkers,
                fetchPlaceDetails: async (id) => {
                    console.log(`Fetching details for place ID: ${id}`);
                },
                setSelectedPlace,
                setIsModalOpen,
            });
        }
    }, [map, clusterer, records]);

    const handleRecordAdd = (newRecord: PerformanceRecord) => {
        setRecords((prevRecords) => [...prevRecords, newRecord]);
        if (map && clusterer) {
            const places = [...records, newRecord].map<Place>((record) => ({
                id: record.id, // id를 그대로 사용
                name: record.description,
                part: record.part as 'BAND' | 'DANCE' | 'VOCAL',
                type: record.type,
                coordinate: { latitude: record.latitude, longitude: record.longitude },
                region: record.region,
                address: record.address,
            }));
            updateMarkers({
                places,
                map,
                clusterer,
                setMarkers,
                fetchPlaceDetails: async (id) => {
                    console.log(`Fetching details for place ID: ${id}`);
                },
                setSelectedPlace,
                setIsModalOpen,
            });
        }
    };

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
                <Map
                    places={records.map((record) => ({
                        id: record.id, // id를 그대로 사용
                        name: record.description,
                        part: record.part as 'BAND' | 'DANCE' | 'VOCAL',
                        type: record.type,
                        coordinate: { latitude: record.latitude, longitude: record.longitude },
                        region: record.region,
                        address: record.address,
                    }))}
                    map={map}
                    setMap={setMap}
                    clusterer={clusterer}
                    setClusterer={setClusterer}
                    fetchPlaceDetails={async (id) => {
                        console.log(`Fetching details for place ID: ${id}`);
                    }}
                    kakaoMapApiKey={process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || ''}
                />
            </div>
            <div className="grid grid-cols-1 gap-4">
                {records.length > 0 ? (
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
            {isWritePostOpen && (
                <PerformanceWritePostModal onClose={() => setWritePostOpen(false)} onRecordAdd={handleRecordAdd} />
            )}
        </div>
    );
};

export default PerformanceRecord;
