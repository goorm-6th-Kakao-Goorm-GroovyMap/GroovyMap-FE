/* eslint-disable @next/next/no-img-element */ // 이미지 src 넣을 때 에러 수정하기 위해 추가
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IoMdSearch } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa';
import { getPracticePlaces, addPracticePlace, getPracticePlaceDetails } from '@/api/placeApi/practicePlaceApi';
import type { PracticePlace, PracticePlaceResponse } from '@/types/types';
import PracticePlaceList from './components/PracticePlaceList';
import PracticePlaceMap from './components/PracticePlaceMap';
import PracticePlaceDetailsModal from './components/PracticePlaceDetailsModal';
import AddPracticePlaceModal from './components/AddPracticePlaceModal';

//지도 분야별 마커 이미지
const markerImages: { [key: string]: string } = {
    BAND: '/guitar.svg',
    DANCE: '/guitar.svg',
    VOCAL: '/guitar.svg',
    default: '/guitar.svg',
};

//지역별 위 경도
const regionCoordinates: { [key: string]: { latitude: number; longitude: number } } = {
    ALL: { latitude: 37.5665, longitude: 126.978 },
    GANGNAMGU: { latitude: 37.5172, longitude: 127.0473 },
    GANGDONGGU: { latitude: 37.5301, longitude: 127.1237 },
    GANGBUKGU: { latitude: 37.6396, longitude: 127.0257 },
    GANGSEOGU: { latitude: 37.551, longitude: 126.8495 },
    GEUMCHEONGU: { latitude: 37.4563, longitude: 126.8958 },
    GUROGU: { latitude: 37.4955, longitude: 126.8876 },
    DOBONGGU: { latitude: 37.6659, longitude: 127.0318 },
    DONGDAEMUNGU: { latitude: 37.5743, longitude: 127.0398 },
    DONGJAKGU: { latitude: 37.5124, longitude: 126.9394 },
    MAPOGU: { latitude: 37.566, longitude: 126.901 },
    SEODAEMUNGU: { latitude: 37.5793, longitude: 126.9368 },
    SEOCHOGU: { latitude: 37.4836, longitude: 127.0327 },
    SEONGDONGGU: { latitude: 37.5613, longitude: 127.0384 },
    SEONGBUKGU: { latitude: 37.5894, longitude: 127.0167 },
    SONGPA: { latitude: 37.5145, longitude: 127.1056 },
    YANGCHEONGU: { latitude: 37.5165, longitude: 126.8661 },
    YEONGDEUNGPOGU: { latitude: 37.5244, longitude: 126.929 },
    YONGSANGU: { latitude: 37.5326, longitude: 126.99 },
    EUNPYEONGGU: { latitude: 37.6176, longitude: 126.9227 },
    JONGNOGU: { latitude: 37.5725, longitude: 126.978 },
    JUNGGU: { latitude: 37.5641, longitude: 126.9979 },
    JUNGNANGGU: { latitude: 37.6063, longitude: 127.093 },
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
    const [markers, setMarkers] = useState<any[]>([]);
    const [filteredPracticePlaces, setFilteredPracticePlaces] = useState<PracticePlace[]>([]);
    const [map, setMap] = useState<any>(null);
    const [clusterer, setClusterer] = useState<any>(null);
    const [selectedPlace, setSelectedPlace] = useState<PracticePlace | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [address, setAddress] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
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

    const addPlaceMutation = useMutation<number, Error, Omit<PracticePlace, 'id'>>({
        mutationFn: addPracticePlace,
        onSuccess: async (newPlace) => {
            if (newPlace.id === undefined) {
                console.error('Returned ID is undefined.');
                toast.error('새로운 장소의 ID를 가져오는 데 실패했습니다.');
                return;
            }

            try {
                //새 장소의 상세정보 아이디로 가져옴.
                const newPlaceDetails = await getPracticePlaceDetails(newPlace.id);
                //장소 데이터 다시 갱신 함.
                queryClient.invalidateQueries({ queryKey: ['practicePlaces'] });
                //새 장소의 상세 정보를 추가함
                setFilteredPracticePlaces((prev) => {
                    if (Array.isArray(prev)) {
                        return [...prev, newPlaceDetails];
                    } else {
                        return [newPlaceDetails];
                    }
                });

                // 지도에 새로운 장소의 마커 추가
                if (map && clusterer) {
                    const { latitude, longitude } = newPlaceDetails.coordinate;
                    const markerCoordinate = new window.kakao.maps.LatLng(latitude, longitude);

                    const markerImage = new window.kakao.maps.MarkerImage(
                        markerImages[newPlaceDetails.part] || markerImages.default,
                        new window.kakao.maps.Size(24, 35),
                        { offset: new window.kakao.maps.Point(12, 35) }
                    );

                    const marker = new window.kakao.maps.Marker({
                        position: markerCoordinate,
                        image: markerImage,
                    });

                    const infowindow = new window.kakao.maps.InfoWindow({
                        content: `<div style="padding:5px;">${newPlaceDetails.name}</div>`,
                    });

                    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
                        infowindow.open(map, marker);
                    });

                    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                        infowindow.close();
                    });

                    window.kakao.maps.event.addListener(marker, 'click', () => {
                        setSelectedPlace(newPlaceDetails);
                        setIsModalOpen(true);
                        fetchPlaceDetails(newPlaceDetails.id as number); // fetchPlaceDetails 함수 호출
                    });

                    marker.setMap(map); // 마커를 지도에 추가
                    clusterer.addMarker(marker); // 클러스터러에 마커 추가
                    setMarkers((prevMarkers) => [...prevMarkers, marker]);

                    map.setCenter(markerCoordinate);
                    map.setLevel(3); // 줌 레벨 설정 (작은 숫자일수록 더 확대됨)
                }

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
        const filtered = placesList.filter((place: { region: string; part: string }) => {
            const regionMatch = selectedRegion === 'ALL' || place.region === selectedRegion;
            const partMatch = selectedPart === 'all' || place.part === selectedPart;
            return regionMatch && partMatch;
        });
        setFilteredPracticePlaces(filtered);

        if (map) {
            if (selectedRegion !== 'ALL') {
                const regionCoord = regionCoordinates[selectedRegion];
                const center = new window.kakao.maps.LatLng(regionCoord.latitude, regionCoord.longitude);
                map.setCenter(center);
                map.setLevel(5); // 줌 레벨 설정
            } else {
                map.setCenter(new window.kakao.maps.LatLng(37.5665, 126.978));
                map.setLevel(5); // 기본 줌 레벨 설정
            }

            if (Array.isArray(filtered)) {
                updateMarkers(filtered);
            } else {
                console.error('filteredPracticePlaces is not an array:', filteredPracticePlaces);
            }
        }
    }, [selectedRegion, selectedPart, placesList, map]);

    //필터된 공연장소에 마커 업데이트
    useEffect(() => {
        if (map) {
            if (Array.isArray(filteredPracticePlaces)) {
                updateMarkers(filteredPracticePlaces);
            } else {
                console.error('filteredPracticePlaces is not an array:', filteredPracticePlaces);
            }
        }
    }, [map, filteredPracticePlaces]);

    const updateMarkers = (places: PracticePlace[]) => {
        if (!Array.isArray(places)) {
            console.error('places is not an array:', places);
            return;
        }

        if (map && clusterer) {
            const bounds = new window.kakao.maps.LatLngBounds();

            const newMarkers = places.map((place) => {
                const markerCoordinate = new window.kakao.maps.LatLng(
                    place.coordinate?.latitude,
                    place.coordinate?.longitude
                );
                bounds.extend(markerCoordinate);

                const markerImage = new window.kakao.maps.MarkerImage(
                    markerImages[place.part] || markerImages.default,
                    new window.kakao.maps.Size(24, 35),
                    { offset: new window.kakao.maps.Point(12, 35) }
                );

                const marker = new window.kakao.maps.Marker({
                    position: markerCoordinate,
                    image: markerImage,
                });

                const infowindow = new window.kakao.maps.InfoWindow({
                    content: `<div style="padding:5px;">${place.name}</div>`,
                });

                window.kakao.maps.event.addListener(marker, 'mouseover', () => {
                    infowindow.open(map, marker);
                });

                window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                    infowindow.close();
                });

                window.kakao.maps.event.addListener(marker, 'click', () => {
                    setSelectedPlace(place);
                    setIsModalOpen(true);
                    fetchPlaceDetails(place.id as number); // fetchPlaceDetails 함수 호출
                    window.location.href = `/performanceplace/${place.id}`;
                });

                marker.setMap(map); // 마커를 지도에 추가

                return marker;
            });

            setMarkers((prevMarkers) => {
                prevMarkers.forEach((marker) => marker?.setMap(null)); // 이전 마커 제거
                return newMarkers;
            });

            clusterer.clear(); // 이전 마커 클러스터 제거
            clusterer.addMarkers(newMarkers); // 새로운 마커 클러스터 추가

            if (!bounds.isEmpty()) {
                map.setBounds(bounds);
            }
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleTitleClick = (latitude: number, longitude: number) => {
        if (map) {
            map.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
            map.setLevel(3);
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
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <div className="absolute  left-3 top-3 text-gray-400">
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
                        <button
                            className="bg-purple-700 text-white py-2 px-4 rounded-full"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <FaPlus />
                        </button>
                    </div>
                </div>

                <PracticePlaceMap
                    places={filteredPracticePlaces}
                    map={map}
                    setMap={setMap}
                    fetchPlaceDetails={fetchPlaceDetails}
                    clusterer={clusterer} // 클러스터러 전달
                    setClusterer={setClusterer} // 클러스터러 설정 함수 전달
                />

                <PracticePlaceList
                    places={filteredPracticePlaces}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    handlePageChange={handlePageChange}
                    handleTitleClick={handleTitleClick}
                    fetchPlaceDetails={fetchPlaceDetails}
                />

                {isModalOpen && selectedPlace && (
                    <PracticePlaceDetailsModal
                        place={selectedPlace}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}

                {isAddModalOpen && (
                    <AddPracticePlaceModal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        onSubmit={(newPlace) => addPlaceMutation.mutate(newPlace)}
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
