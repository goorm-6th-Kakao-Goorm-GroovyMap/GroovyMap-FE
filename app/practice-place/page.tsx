/* eslint-disable react/jsx-no-undef */
/* eslint-disable @next/next/no-img-element */ // 이미지 src 넣을 때 에러 수정하기 위해 추가
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IoMdSearch, IoMdClose } from 'react-icons/io';
import { FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { getPracticePlaces, addPracticePlace, getPracticePlaceDetails } from '@/api/places/practicePlaceApi';
import type { PracticePlaceResponse, PracticePlace, Place } from '@/types/types';
import DetailsModal from '@/components/Places/DetailsModal';
import AddModal from '@/components/Places/AddModal';
import List from '@/components/Places/List';
import Map from '@/components/Places/Map';
import { updateMarkers } from '@/components/Places/UpdataMarkers';

const markersImages: { [key: string]: string } = {
    BAND: '/guitar.svg',
    DANCE: '/guitar.svg',
    VOCAL: '/guitar.svg',
    default: '/guitar.svg',
};

const PracticePlace: React.FC = () => {
    if (!process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || !process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY) {
        throw new Error('Kakao API keys are not defined in the environment variables');
    }

    const kakaoMapApiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    const kakaoRestApiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

    const [selectedRegion, setSelectedRegion] = useState<
        | 'ALL'
        | 'GANGNAMGU'
        | 'GANGDONGGU'
        | 'GANGBUKGU'
        | 'GANGSEOGU'
        | 'GEUMCHEONGU'
        | 'GUROGU'
        | 'DOBONGGU'
        | 'DONGDAEMUNGU'
        | 'DONGJAKGU'
        | 'MAPOGU'
        | 'SEODAEMUNGU'
        | 'SEOCHOGU'
        | 'SEONGDONGGU'
        | 'SEONGBUKGU'
        | 'SONGPA'
        | 'YANGCHEONGU'
        | 'YEONGDEUNGPOGU'
        | 'YONGSANGU'
        | 'EUNPYEONGGU'
        | 'JONGNOGU'
        | 'JUNGGU'
        | 'JUNGNANGGU'
    >('ALL');
    const [selectedPart, setSelectedPart] = useState<'all' | 'BAND' | 'DANCE' | 'VOCAL'>('all');
    const [filteredPracticePlaces, setFilteredPracticePlaces] = useState<PracticePlace[]>([]);
    const [map, setMap] = useState<any>(null);
    const [clusterer, setClusterer] = useState<any>(null);
    const [markers, setMarkers] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPlace, setSelectedPlace] = useState<PracticePlace | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPlace, setNewPlace] = useState<Omit<PracticePlace, 'id'>>({
        name: '',
        part: 'BAND',
        coordinate: { latitude: 0, longitude: 0 },
        region: '',
        address: '',
        phoneNumber: '',
        rentalFee: '',
        capacity: '',
        practiceHours: '',
        description: '',
    });
    const itemsPerPage = 5;
    const queryClient = useQueryClient();

    const { data: practicePlacesData } = useQuery<PracticePlaceResponse, Error>({
        queryKey: ['practicePlaces'],
        queryFn: getPracticePlaces,
    });

    const placesList = useMemo(() => practicePlacesData?.practicePlacePosts || [], [practicePlacesData]);

    useEffect(() => {
        if (placesList) {
            setFilteredPracticePlaces(placesList);
        }
    }, [placesList]);

    const addPlaceMutation = useMutation<PracticePlace, Error, Omit<PracticePlace, 'id'>>({
        mutationFn: addPracticePlace,
        onSuccess: async (newPlace) => {
            if (!newPlace.id) {
                console.error('Returned ID is undefined.');
                toast.error('새로운 장소의 ID를 가져오는 데 실패했습니다.');
                return;
            }

            try {
                const newPlaceDetails = await getPracticePlaceDetails(newPlace.id);
                queryClient.invalidateQueries({ queryKey: ['practicePlaces'] });
                setFilteredPracticePlaces((prev) => {
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
                    practiceHours: '',
                    description: '',
                });
                toast.success('새로운 연습 장소가 성공적으로 추가되었습니다.');
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
            const data = await getPracticePlaceDetails(postId);
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
            setFilteredPracticePlaces(filtered);
        }
    }, [selectedRegion, selectedPart, placesList]);

    useEffect(() => {
        if (map) {
            if (Array.isArray(filteredPracticePlaces)) {
                updateMarkers<PracticePlace>({
                    places: filteredPracticePlaces,
                    map,
                    clusterer,
                    setMarkers,
                    fetchPlaceDetails,
                    setSelectedPlace,
                    setIsModalOpen,
                });
            } else {
                console.error('filteredPracticePlaces is not an array:', filteredPracticePlaces);
            }
        }
    }, [map, filteredPracticePlaces, clusterer, fetchPlaceDetails]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleTitleClick = (latitude: number, longitude: number) => {
        if (map) {
            map.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
            map.setLevel(3); // 줌 레벨 설정 (작은 숫자일수록 더 확대됨)
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
                    <h1 className="text-3xl font-extrabold text-purple-700">연습 장소</h1>
                </header>
                <div className="flex flex-wrap justify-between items-center mb-6 space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center border rounded-lg p-2 bg-white">
                            <label className="font-bold mr-2">지역</label>
                            <select
                                className="border-none p-2 bg-white"
                                value={selectedRegion}
                                onChange={(e) =>
                                    setSelectedRegion(e.target.value as 'ALL' | 'GANGNAMGU' | 'MAPOGU' | 'GANGDONGGU')
                                }
                            >
                                <option value="ALL">전체</option>
                                <option value="GANGNAMGU">강남구</option>
                                <option value="GANGDONGGU">강동구</option>
                                <option value="GANGBUKGU">강북구</option>
                                <option value="GANGSEOGU">강서구</option>
                                <option value="GEUMCHEONGU">금천구</option>
                                <option value="GUROGU">구로구</option>
                                <option value="DOBONGGU">도봉구</option>
                                <option value="DONGDAEMUNGU">동대문구</option>
                                <option value="DONGJAKGU">동작구</option>
                                <option value="MAPOGU">마포구</option>
                                <option value="SEODAEMUNGU">서대문구</option>
                                <option value="SEOCHOGU">서초구</option>
                                <option value="SEONGDONGGU">성동구</option>
                                <option value="SEONGBUKGU">성북구</option>
                                <option value="SONGPA">송파구</option>
                                <option value="YANGCHEONGU">양천구</option>
                                <option value="YEONGDEUNGPOGU">영등포구</option>
                                <option value="YONGSANGU">용산구</option>
                                <option value="EUNPYEONGGU">은평구</option>
                                <option value="JONGNOGU">종로구</option>
                                <option value="JUNGGU">중구</option>
                                <option value="JUNGNANGGU">중랑구</option>
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
                        <button className="bg-purple-700 text-white py-2 px-4 rounded-full">
                            <FaMapMarkerAlt />
                        </button>
                        <button
                            className="bg-purple-700 text-white py-2 px-4 rounded-full"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <FaPlus />
                        </button>
                    </div>
                </div>

                <Map
                    places={filteredPracticePlaces}
                    map={map}
                    setMap={setMap}
                    clusterer={clusterer}
                    setClusterer={setClusterer}
                    fetchPlaceDetails={fetchPlaceDetails}
                    kakaoMapApiKey={kakaoMapApiKey}
                />

                <List
                    places={filteredPracticePlaces}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    handlePageChange={handlePageChange}
                    handleTitleClick={handleTitleClick}
                    fetchPlaceDetails={fetchPlaceDetails}
                    type={'practice'}
                />

                {isModalOpen && selectedPlace && (
                    <DetailsModal place={selectedPlace} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                )}

                {isAddModalOpen && (
                    <AddModal<PracticePlace>
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        onSubmit={(newPlace: Omit<PracticePlace, 'id'>) => addPlaceMutation.mutate(newPlace)}
                        kakaoRestApiKey={kakaoRestApiKey}
                        newPlace={newPlace}
                        setNewPlace={setNewPlace}
                    />
                )}
            </div>
        </div>
    );
};

export default PracticePlace;
