'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { useParams } from 'next/navigation';
import PerformanceWritePostModal from './Modal/PerformanceWritePostModal.tsx';
import { areas, parts, types } from '@/constants/constants';
import type { User, PerformanceRecord, Place } from '@/types/types';
import Map from '@/components/Places/Map';
import { updateMarkers } from '@/components/Places/UpdataMarkers';
import { toast, ToastContainer } from 'react-toastify';
import SkeletonLoader from '@/components/SkeletonLoader';

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
    const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1); //페이지 네이션 상태관리
    const recordsPerPage = 5;
    const totalPages = Math.ceil(records.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

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
                    console.log(`공연 기록 장소 페치 아이디: ${id}`);
                },
                setSelectedPlace,
                setIsModalOpen,
            });
        }
    };

    //글 삭제 기능
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/mypage/performance/${id}`);
        },
        onSuccess: () => {
            refetch();
            toast.success('공연 기록이 성공적으로 삭제되었습니다.');
        },
        onError: () => {
            toast.error('공연 기록 삭제 중 오류가 발생했습니다.');
        },
    });

    //글 삭제 버튼 함수
    const handleDelete = (id: string) => {
        toast(
            <div className="flex flex-col items-center justify-center">
                <p>공연 기록을 삭제하시겠습니까?</p>
                <div className="flex justify-around mt-2">
                    <button
                        onClick={() => {
                            deleteMutation.mutate(id);
                            toast.dismiss();
                        }}
                        className="bg-purple-500 text-white mr-3 px-3 py-1 rounded"
                    >
                        예
                    </button>
                    <button onClick={() => toast.dismiss()} className="bg-gray-300 px-3 py-1 rounded">
                        아니오
                    </button>
                </div>
            </div>,
            {
                closeButton: false,
                autoClose: false,
            }
        );
    };

    const toggleExpand = (id: string) => {
        setExpandedRecordId((prev) => (prev === id ? null : id));
    };

    //공연 기록 누르면 지도에서 위치로
    const handlePlaceClick = (record: PerformanceRecord) => {
        if (map) {
            const moveLatLon = new window.kakao.maps.LatLng(record.latitude, record.longitude);
            map.setCenter(moveLatLon);
        }
    };

    //로딩시 스켈레톤
    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (error) {
        console.error('공연 기록 페치 에러:', error);
        return <div>공연 기록을 불러오는 데 에러가 발생했습니다.</div>;
    }

    //페이지 네이션 함수
    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`mx-1 px-3 py-1 rounded ${
                        i === currentPage ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-700'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return <div className="flex justify-center mt-4">{pages}</div>;
    };

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
                {currentRecords.length > 0 ? (
                    currentRecords.map((record) => (
                        <div key={record.id} className="border p-4 rounded">
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => toggleExpand(record.id)}
                            >
                                <p>
                                    <span
                                        className="font-bold hover:text-purple-500 cursor-pointer"
                                        onClick={() => handlePlaceClick(record)}
                                    >
                                        {record.description}
                                    </span>{' '}
                                    <span className="text-gray-500 bg-gray-100 p-0.5 ml-1.5 mr-1.5">
                                        {parts[record.part]?.name || record.part}
                                    </span>
                                    <span className="text-gray-500 bg-gray-100 p-0.5">
                                        {types[record.type]?.name || record.type}
                                    </span>
                                </p>
                                <button
                                    onClick={() => handlePlaceClick(record)}
                                    className="ml-4 text-purple-500 hover:text-purple-600"
                                >
                                    {expandedRecordId === record.id ? <FaChevronUp /> : <FaChevronDown />}
                                </button>
                            </div>
                            {expandedRecordId === record.id && (
                                <div className="mt-2 relative">
                                    <p>
                                        {record.address}, {record.date}{' '}
                                    </p>
                                    <p>
                                        {areas[record.region]?.name || record.region},{' '}
                                        {parts[record.part]?.name || record.part},{' '}
                                        {types[record.type]?.name || record.type}
                                    </p>

                                    {isOwner && (
                                        <button
                                            onClick={() => handleDelete(record.id)} //id로 delete 요청
                                            className="absolute bottom-2 right-2 bg-gray-300 text-gray-700 p-1 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div>공연 기록이 없습니다.</div>
                )}
            </div>
            {renderPagination()} {/* 페이지네이션 추가 */}
            {isWritePostOpen && (
                <PerformanceWritePostModal onClose={() => setWritePostOpen(false)} onRecordAdd={handleRecordAdd} />
            )}
            <ToastContainer position="top-center" limit={1} /> {/* ToastContainer 추가 */}
        </div>
    );
};

export default PerformanceRecord;
