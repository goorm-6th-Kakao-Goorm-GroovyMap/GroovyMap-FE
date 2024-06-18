/* eslint-disable react/jsx-no-undef */
/* eslint-disable @next/next/no-img-element */ // 이미지 src 넣을 때 에러 수정하기 위해 추가
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IoMdSearch, IoMdClose } from 'react-icons/io';
import { FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import {
    getPerformancePlaces,
    addPerformancePlace,
    getPerformancePlaceDetails,
} from '@/api/places/performancePlaceApi';
import type { PerformancePlaceResponse, PerformancePlace, Place } from '@/types/types';
import DetailsModal from '@/components/Places/DetailsModal';
import AddModal from '@/components/Places/AddModal';
import List from '@/components/Places/List';
import Map from '@/components/Places/Map';
import { updateMarkers } from '@/components/Places/UpdataMarkers';
import { regions, regionNames, Region } from '@/constants/region';
import { useRouter } from 'next/navigation';
//유저 가져오기
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/state/userState';

const markerImages: { [key: string]: string } = {
    BAND: '/guitar.svg',
    DANCE: '/guitar.svg',
    VOCAL: '/guitar.svg',
    default: '/guitar.svg',
};

const PerformancePlace: React.FC = () => {
    if (!process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || !process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY) {
        throw new Error('Kakao API keys are not defined in the environment variables');
    }

    const kakaoMapApiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    const kakaoRestApiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
    const router = useRouter();
    const user = useRecoilValue(userState);
    const [selectedRegion, setSelectedRegion] = useState<Region>(regions.ALL);
    const [selectedPart, setSelectedPart] = useState<'all' | 'BAND' | 'DANCE' | 'VOCAL'>('all');
    const [filteredPerformancePlaces, setFilteredPerformancePlaces] = useState<PerformancePlace[]>([]);
    const [map, setMap] = useState<any>(null);
    const [clusterer, setClusterer] = useState<any>(null);
    const [markers, setMarkers] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPlace, setSelectedPlace] = useState<PerformancePlace | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPlace, setNewPlace] = useState<Omit<PerformancePlace, 'id'>>({
        name: '',
        part: 'BAND',
        coordinate: { latitude: 0, longitude: 0 },
        region: '',
        address: '',
        phoneNumber: '',
        rentalFee: '',
        capacity: '',
        performanceHours: '',
        description: '',
    });
    const itemsPerPage = 5;
    const queryClient = useQueryClient();

    const { data: performancePlacesData } = useQuery<PerformancePlaceResponse, Error>({
        queryKey: ['performancePlaces'],
        queryFn: getPerformancePlaces,
    });

    const placesList = useMemo(() => performancePlacesData?.performancePlacePosts || [], [performancePlacesData]);

    useEffect(() => {
        if (placesList) {
            setFilteredPerformancePlaces(placesList);
        }
    }, [placesList]);

    const addPlaceMutation = useMutation<PerformancePlace, Error, Omit<PerformancePlace, 'id'>>({
        mutationFn: addPerformancePlace,
        onSuccess: async (newPlace) => {
            if (!newPlace.id) {
                console.error('Returned ID is undefined.');
                toast.error('새로운 장소의 ID를 가져오는 데 실패했습니다.');
                return;
            }

            try {
                const newPlaceDetails = await getPerformancePlaceDetails(newPlace.id);
                queryClient.invalidateQueries({ queryKey: ['performancePlaces'] });
                setFilteredPerformancePlaces((prev) => {
                    if (Array.isArray(prev)) {
                        return [...prev, newPlaceDetails];
                    } else {
                        return [newPlaceDetails];
                    }
                });
                setIsAddModalOpen(false);
                setNewPlace({
                    name: '',
                    part: 'BAND',
                    coordinate: { latitude: 0, longitude: 0 },
                    region: '',
                    address: '',
                    phoneNumber: '',
                    rentalFee: '',
                    capacity: '',
                    performanceHours: '',
                    description: '',
                });
                toast.success('새로운 공연 장소가 성공적으로 추가되었습니다.');
            } catch (error) {
                console.error('Error fetching new place details:', error);
                toast.error('새로운 장소를 추가하는데 실패했습니다.');
            }
        },
        onError: (error) => {
            console.error('Error adding new place:', error);
            toast.error('장소 추가에 실패했습니다. 다시 시도해 주세요.');
        },
    });

    const fetchPlaceDetails = useCallback(async (postId: number) => {
        try {
            const data = await getPerformancePlaceDetails(postId);
            setSelectedPlace(data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    }, []);

    useEffect(() => {
        if (placesList && Array.isArray(placesList)) {
            const filtered = placesList.filter((place) => {
                const regionMatch = selectedRegion === 'ALL' || place.region === selectedRegion;
                const partMatch = selectedPart === 'all' || place.part === selectedPart;
                return regionMatch && partMatch;
            });
            setFilteredPerformancePlaces(filtered);
        }
    }, [selectedRegion, selectedPart, placesList]);

    useEffect(() => {
        if (map) {
            if (Array.isArray(filteredPerformancePlaces)) {
                updateMarkers<PerformancePlace>({
                    places: filteredPerformancePlaces,
                    map,
                    clusterer,
                    setMarkers,
                    fetchPlaceDetails,
                    setSelectedPlace,
                    setIsModalOpen,
                });
            } else {
                console.error('filteredPerformancePlaces is not an array:', filteredPerformancePlaces);
            }
        }
    }, [map, filteredPerformancePlaces, clusterer, fetchPlaceDetails]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleTitleClick = (latitude: number, longitude: number) => {
        if (map) {
            map.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
            map.setLevel(3); // 줌 레벨 설정 (작은 숫자일수록 더 확대됨)
        }
    };

    //로그인 유저만 글쓰게
    const handleAddButtonClick = () => {
        if (!user) {
            toast.error('로그인 유저만 글쓰기 가능합니다.');
            setTimeout(() => {
                router.push('/login');
            }, 1500);
        } else {
            setIsAddModalOpen(true);
        }
    };

    return (
        <div className="content p-6 bg-purple-50 min-h-screen">
            <ToastContainer />
            <div className="content flex-1 w-full max-w-4xl mx-auto">
                <div className="flex justify-center items-center mb-6">
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="w-full border rounded p-2 pl-10"
                            placeholder="검색어를 입력하세요..."
                        />
                        <div className="absolute left-3 top-3 text-gray-400">
                            <IoMdSearch size={20} />
                        </div>
                    </div>
                </div>
                <header className="header mb-6">
                    <h1 className="text-3xl font-extrabold text-purple-700">공연 장소</h1>
                </header>
                <div className="flex flex-wrap justify-between items-center mb-6 space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center border rounded-lg p-2 bg-white">
                            <label className="font-bold mr-2">지역</label>
                            <select
                                className="border-none p-2 bg-white"
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value as Region)}
                            >
                                {regionNames &&
                                    Object.entries(regionNames).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="flex items-center border rounded-lg p-2 bg-white">
                            <label className="font-bold mr-2">유형</label>
                            <select
                                className="border-none p-2 bg-white"
                                value={selectedPart}
                                onChange={(e) => setSelectedPart(e.target.value as 'all' | 'BAND' | 'DANCE' | 'VOCAL')}
                            >
                                <option value="all">전체</option>
                                <option value="BAND">밴드</option>
                                <option value="DANCE">댄스</option>
                                <option value="VOCAL">노래</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            className="bg-purple-700 text-white py-2 px-4 rounded-full"
                            onClick={handleAddButtonClick}
                        >
                            <FaPlus />
                        </button>
                    </div>
                </div>

                <Map
                    places={filteredPerformancePlaces}
                    map={map}
                    setMap={setMap}
                    clusterer={clusterer}
                    setClusterer={setClusterer}
                    fetchPlaceDetails={fetchPlaceDetails}
                    kakaoMapApiKey={kakaoMapApiKey}
                />

                <List
                    places={filteredPerformancePlaces}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    handlePageChange={handlePageChange}
                    handleTitleClick={handleTitleClick}
                    fetchPlaceDetails={fetchPlaceDetails}
                    type={'performance'}
                />

                {isModalOpen && selectedPlace && (
                    <DetailsModal place={selectedPlace} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                )}

                {isAddModalOpen && (
                    <AddModal<PerformancePlace>
                        selectedRegion={selectedRegion}
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        onSubmit={(newPlace: Omit<PerformancePlace, 'id'>) => addPlaceMutation.mutate(newPlace)}
                        kakaoRestApiKey={kakaoRestApiKey}
                        newPlace={newPlace}
                        setNewPlace={setNewPlace}
                    />
                )}
            </div>
        </div>
    );
};

export default PerformancePlace;
