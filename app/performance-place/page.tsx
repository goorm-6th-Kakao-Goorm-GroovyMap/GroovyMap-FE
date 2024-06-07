/* eslint-disable @next/next/no-img-element */ // 이미지 src 넣을 때 에러 수정하기 위해 추가
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
//import { useQuery, useMutation, useQueryClient } from 'react-query';
//import { getPerformancePlaces, addPerformancePlace, getPerformancePlaceDetails } from '../../api/placeApi/performancePlaceApi.ts';
import { IoMdSearch, IoMdClose } from 'react-icons/io';
import { FaMapMarkerAlt, FaMapPin, FaClock, FaPhoneAlt, FaTag, FaPlus } from 'react-icons/fa';
import { Map, MapTypeControl, MapMarker, ZoomControl, MarkerClusterer } from 'react-kakao-maps-sdk';
import type { PerformancePlace } from '../../types/types';

// 나중에 실제 api 가져오면 삭제
const mockPerformancePlace = [
    {
        id: 1,
        name: '홍대 거리',
        part: 'BAND',
        coordinate: { latitude: 37.5551, longitude: 126.9236 },
        region: 'MAPOGU',
        address: '서울특별시 마포구 홍익로 5길 20',
        phoneNumber: '02-3141-1411',
        rentalFee: '무료',
        capacity: '200명',
        performanceHours: '12:00 - 22:00',
        description: '홍대에서 가장 유명한 버스킹 장소.',
    },
    {
        id: 2,
        name: '공연 장소 이름',
        part: 'DANCE',
        coordinate: { latitude: 37.4989, longitude: 127.0276 },
        region: 'GANGNAMGU',
        address: '서울특별시 강남구 강남대로 396',
        phoneNumber: '02-555-5555',
        rentalFee: '무료',
        capacity: '300명',
        performanceHours: '10:00 - 22:00',
        description: '다양한 공연과 이벤트가 열리는 장소입니다.',
    },
];

// 나중에 마커 이미지 바꾸기
const markerImages = {
    BAND: '/guitar.svg',
    DANCE: '/guitar.svg',
    VOCAL: '/guitar.svg',
    default: '/guitar.svg',
};

const PerformancePlace: React.FC = () => {
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
    const [selectedPart, setSelectedPart] = useState<'all' | 'BAND' | 'DANCE' | 'VOCAL'>('all'); // 분야 더 추가
    const [performancePlaces, setPerformancePlaces] = useState<PerformancePlace[]>(mockPerformancePlace); // 실제 api 요청받을때는 삭제;
    const [filteredPerformancePlaces, setFilteredPerformancePlaces] =
        useState<PerformancePlace[]>(mockPerformancePlace); // 실제 api 요청 받을때는 빈 배열로 설정 useState<PerformancePlace[]>([]);
    const [map, setMap] = useState<any>(null);
    const [clusterer, setClusterer] = useState<any>(null);
    const [selectedPlace, setSelectedPlace] = useState<PerformancePlace | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [markers, setMarkers] = useState<any[]>([]);
    const [searchMap, setSearchMap] = useState<any>(null);
    const [searchMarkers, setSearchMarkers] = useState<any[]>([]);

    // 새 장소 추가해서 post 요청 보낼때 형태
    const [newPlace, setNewPlace] = useState<Omit<PerformancePlace, 'id'>>({
        name: '',
        part: '',
        coordinate: { latitude: 0, longitude: 0 },
        region: '',
        address: '',
        phoneNumber: '',
        rentalFee: '',
        capacity: '',
        performanceHours: '',
        description: '',
    });
    const [address, setAddress] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);
    // 페이지 네이션을 위한 상태 추가함
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // 페이지 변경 핸들러 추가
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // 데이터 필터링 및 페이지 네이션 적용
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPerformancePlaces.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 숫자 계산
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredPerformancePlaces.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }
    //     //API 연동시 주석 해제
    //     const queryClient = useQueryClient();

    // // 전체 공연 장소 정보 가져옴
    // const { data: performancePlaces, isLoading } = useQuery<PerformancePlace[]>('performancePlaces', getPerformancePlaces, {
    //     onSuccess: (data) => {
    //         setFilteredPerformancePlaces(data);
    //     },
    // });

    // // 새로운 장소 저장하고 추가하는 부분
    // const addPlaceMutation = useMutation<Place, Error, Omit<Place, 'id'>>(addPerformancePlace, {
    //     onSuccess: (data) => {
    //         queryClient.invalidateQueries('performancePlaces');
    //         setFilteredPerformancePlaces((prev) => [...prev, data]);
    //         setIsAddModalOpen(false);
    //         setNewPlace({
    //             name: '',
    //             part: '',
    //             coordinate: { latitude: 0, longitude: 0 },
    //             region: '',
    //             address: '',
    //             phoneNumber: '',
    //             rentalFee: '',
    //             capacity: '',
    //             performanceHours: '',
    //             description: '',
    //         });
    //     },
    //     onError: (error) => {
    //         console.error('Error adding new place:', error);
    //     },
    // });

    // 지역 및 분야로 데이터 필터링 하는 부분
    useEffect(() => {
        const filtered = performancePlaces.filter((place) => {
            const regionMatch = selectedRegion === 'ALL' || place.region === selectedRegion;
            const partMatch = selectedPart === 'all' || place.part === selectedPart;
            return regionMatch && partMatch;
        });
        setFilteredPerformancePlaces(filtered);
    }, [selectedRegion, selectedPart, performancePlaces]);

    // 환경 변수 확인
    if (!process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY) {
        throw new Error('NEXT_PUBLIC_KAKAO_MAP_API_KEY is not defined in the environment variables');
    }
    if (!process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY) {
        throw new Error('NEXT_PUBLIC_KAKAO_REST_API_KEY is not defined in the environment variables');
    }
    //환경 변수 api key
    const kakaoMapApiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    const kakaoRestApiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

    // 카카오맵 api 가져오는 부분
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApiKey}&autoload=false&libraries=clusterer`;
        script.onload = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById('map');
                const mapOption = {
                    center: new window.kakao.maps.LatLng(37.5665, 126.978),
                    level: 5,
                };
                const map = new window.kakao.maps.Map(mapContainer, mapOption);
                setMap(map);

                // 스카이뷰 컨트롤 추가
                const mapTypeControl = new window.kakao.maps.MapTypeControl();
                map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

                // 줌 컨트롤 추가
                const zoomControl = new window.kakao.maps.ZoomControl();
                map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

                // 클러스터러 생성 및 설정
                const clusterer = new window.kakao.maps.MarkerClusterer({
                    map: map,
                    averageCenter: true,
                    minLevel: 10, // 클러스터 할 최소 줌 레벨
                });
                setClusterer(clusterer);
            });
        };
        document.head.appendChild(script);
    }, []);

    useEffect(() => {
        if (map) {
            updateMarkers(filteredPerformancePlaces);
        }
    }, [map, filteredPerformancePlaces]);

    // 상세정보 페치(나중에 삭제)
    const fetchPlaceDetails = (postId: number) => {
        const place = performancePlaces.find((p) => p.id === postId);
        setSelectedPlace(place || null);
        setIsModalOpen(true);
    };

    // //API 연동시 주석해제
    // // 특정 게시물의 상세정보 가져오기
    // const fetchPlaceDetails = (postId: number) => {
    //     useQuery(['performancePlace', postId], () => getPerformancePlaceDetails(postId), {
    //         onSuccess: (data) => {
    //             setSelectedPlace(data);
    //             setIsModalOpen(true);
    //         },
    //         onError: (error) => {
    //             console.error('Error fetching place details:', error);
    //         },
    //     });
    // };

    // 사용자가 새로운 장소 정보 추가 입력할 때 상태 업데이트
    const handleAddPlaceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'latitude' || name === 'longitude') {
            setNewPlace((prev) => ({
                ...prev,
                coordinate: {
                    ...prev.coordinate,
                    [name]: parseFloat(value), // 문자열을 숫자로 변환하여 저장
                },
            }));
        } else {
            setNewPlace((prev) => ({ ...prev, [name]: value }));
        }
    };

    // (나중에 삭제) 새로운 장소추가 플러스 버튼 누르고 추가버튼 누를때 POST 요청(Mock up)
    const handleAddPlaceSubmit = () => {
        // 유효성 검사
        if (!newPlace.name || !newPlace.part || !newPlace.region || !newPlace.address) {
            Swal.fire({
                icon: 'warning',
                title: '필드를 입력해주세요',
                text: '공연 장소 이름, 분야, 지역, 주소는 필수 입력 항목입니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#8c00ff', // 색상은 필요에 따라 변경 가능
                customClass: {
                    popup: 'tailwind-swal-popup',
                    title: 'tailwind-swal-title',
                    content: 'tailwind-swal-content',
                    confirmButton: 'tailwind-swal-button',
                },
            });
            return;
        }

        const newId = performancePlaces.length + 1;
        const place = {
            ...newPlace,
            id: newId,
        };
        const updatedPlaces = [...performancePlaces, place];
        setPerformancePlaces(updatedPlaces);
        setFilteredPerformancePlaces(updatedPlaces);
        setIsAddModalOpen(false);
        setNewPlace({
            name: '',
            part: '',
            coordinate: { latitude: 0, longitude: 0 },
            region: '',
            address: '',
            phoneNumber: '',
            rentalFee: '',
            capacity: '',
            performanceHours: '',
            description: '',
        });

        updateMarkers(updatedPlaces); // 마커 업데이트
    };

    // // 새로운 장소추가 플러스 버튼 누르고 추가버튼 누를때 POST 요청(실제 api)
    // const handleAddPlaceSubmit = async () => {
    // // 유효성 검사
    // if (!newPlace.name || !newPlace.part || !newPlace.region || !newPlace.address) {
    //     Swal.fire({
    //         icon: 'warning',
    //         title: '필드를 입력해주세요',
    //         text: '연습 장소 이름, 분야, 지역, 주소는 필수 입력 항목입니다.',
    //         confirmButtonText: '확인',
    //         confirmButtonColor: '#8c00ff', // 색상은 필요에 따라 변경 가능
    //     });
    //     return;
    // }
    //     addPlaceMutation.mutate(newPlace);
    // };

    const updateMarkers = (places: PerformancePlace[]) => {
        if (map && clusterer) {
            const bounds = new window.kakao.maps.LatLngBounds();

            const newMarkers = places.map((place) => {
                const markerCoordinate = new window.kakao.maps.LatLng(
                    place.coordinate.latitude,
                    place.coordinate.longitude
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
                    fetchPlaceDetails(place.id);
                });

                marker.setMap(map); // 마커를 지도에 추가

                return marker;
            });

            setMarkers((prevMarkers) => {
                prevMarkers.forEach((marker) => marker.setMap(null)); // 이전 마커 제거
                return newMarkers;
            });

            clusterer.clear(); // 이전 마커 클러스터 제거
            clusterer.addMarkers(newMarkers); // 새로운 마커 클러스터 추가

            if (!bounds.isEmpty()) {
                map.setBounds(bounds);
            }
        }
    };

    // 주소 검색 후 결과 값 받아와서 위도 경도 추가
    const handleAddressSearch = async () => {
        try {
            if (!address || address.trim() === '') {
                Swal.fire({
                    icon: 'warning',
                    title: '주소 입력 필요',
                    text: '주소를 입력해 주세요.',
                    confirmButtonText: '확인',
                    customClass: {
                        popup: 'tailwind-swal-popup',
                        title: 'tailwind-swal-title',
                        content: 'tailwind-swal-content',
                        confirmButton: 'tailwind-swal-button',
                    },
                });
                return; // 주소가 빈칸이거나 null이면 함수 종료
            }

            const encodedAddress = encodeURIComponent(address);

            // 카카오 주소 검색 api 호출해서 주소 정보 가져옴
            const response = await axios.get(`https://dapi.kakao.com/v2/local/search/address.json?query=${address}`, {
                headers: { Authorization: `KakaoAK ${kakaoRestApiKey}` },
            });
            const result = response.data.documents[0];
            if (result) {
                // 검색 결과 ui에 반영
                setSearchResult(result);
                // newPlace 상태를 업데이트
                setNewPlace((prev) => ({
                    ...prev,
                    coordinate: {
                        latitude: parseFloat(result.y), // 검색 결과의 위도 값을 coordinate.latitude에 설정
                        longitude: parseFloat(result.x), // 검색 결과의 경도 값을 coordinate.longitude에 설정
                    },
                    address: result.address.address_name,
                }));

                // 마커 추가
                const markerCoordinate = new window.kakao.maps.LatLng(result.y, result.x);
                const marker = new window.kakao.maps.Marker({
                    position: markerCoordinate,
                    map: searchMap, // 검색 지도를 위한 마커 추가
                    image: new window.kakao.maps.MarkerImage(
                        markerImages[newPlace.part] || markerImages.default,
                        new window.kakao.maps.Size(24, 35),
                        { offset: new window.kakao.maps.Point(12, 35) }
                    ),
                });

                // 이전 검색 마커 제거
                searchMarkers.forEach((marker) => marker.setMap(null));
                setSearchMarkers([marker]);

                searchMap.setCenter(markerCoordinate);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '결과 없음',
                    text: '입력한 주소를 찾을 수 없습니다. 다른 주소로 다시 시도해주세요.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#8c00ff', // 색상은 필요에 따라 변경 가능
                    customClass: {
                        popup: 'tailwind-swal-popup',
                        title: 'tailwind-swal-title',
                        content: 'tailwind-swal-content',
                        confirmButton: 'tailwind-swal-button',
                    },
                });
                // 검색 결과가 없음을 알리는 UI
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: '에러 발생',
                text: '주소를 검색하는 중 에러가 발생했습니다. 나중에 다시 시도해주세요.',
                confirmButtonText: '확인',
                confirmButtonColor: '#8c00ff', // 색상은 필요에 따라 변경 가능
                customClass: {
                    popup: 'tailwind-swal-popup',
                    title: 'tailwind-swal-title',
                    content: 'tailwind-swal-content',
                    confirmButton: 'tailwind-swal-button',
                },
            });
        }
    };

    return (
        <div className="content p-6 bg-purple-50 min-h-screen">
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
                                onChange={(e) =>
                                    setSelectedRegion(
                                        e.target.value as
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
                                    )
                                }
                            >
                                <option value="ALL">전체</option>
                                <option value="GANGNAMGU">강남구</option>
                                <option value="GANGDONGGU">강동구</option>
                                <option value="GANGBUKGU">강북구</option>
                                <option value="GANGSEOGU">강서구</option>
                                <option value="GEUMCHEONGU">금천구</option>
                                <option value="GUROGU">구로구</option>
                                <option value="GEUMCHEONGU">금천구</option>
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
                                {/* 지역구 추가하기 */}
                            </select>
                        </div>
                        <div className="flex items-center border rounded-lg p-2 bg-white">
                            <label className="font-bold mr-2">유형</label>
                            <select
                                className="border-none p-2 bg-white"
                                value={selectedPart}
                                onChange={(e) => setSelectedPart(e.target.value as 'all' | 'BAND' | 'DANCE')}
                            >
                                <option value="all">전체</option>
                                <option value="BAND">밴드</option>
                                <option value="DANCE">춤</option>
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
                <div id="map" className="w-full h-96 relative z-0">
                    <Map
                        center={{ lat: 37.5665, lng: 126.978 }}
                        style={{ width: '100%', height: '100%' }}
                        level={5}
                        onCreate={setMap}
                    >
                        <MarkerClusterer>
                            {filteredPerformancePlaces.map((place) => (
                                <MapMarker
                                    key={place.id}
                                    position={place.coordinate}
                                    image={{
                                        src: markerImages[place.part] || markerImages.default,
                                        size: { width: 24, height: 35 },
                                        options: { offset: { x: 12, y: 35 } },
                                    }}
                                    onClick={() => fetchPlaceDetails(place.id)}
                                />
                            ))}
                        </MarkerClusterer>
                        <MapTypeControl position="TOPRIGHT" />
                        <ZoomControl position="RIGHT" />
                    </Map>
                </div>
                <div className="mt-6">
                    <ul className="space-y-4">
                        {currentItems.map((place) => (
                            <li key={place.id} className="border p-4 rounded-lg bg-white shadow-md">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="rounded-ml bg-gray-100 px-1 text-gray-500 dark:bg-gray-300 dark:text-gray-600">
                                            {place.part}
                                        </span>
                                        <h3 className="text-xl my-1 font-semibold">{place.name}</h3>
                                        <p className="text-m text-gray-600 font-regular">{place.address}</p>
                                    </div>
                                    <button
                                        onClick={() => fetchPlaceDetails(place.id)}
                                        className="bg-purple-700 text-white py-2 px-4 rounded-full hover:bg-purple-800 transition-colors duration-300 ease-in-out"
                                    >
                                        상세 정보
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-center space-x-2 mt-4">
                        {pageNumbers.map((number) => (
                            <button
                                key={number}
                                onClick={() => handlePageChange(number)}
                                className={`py-2 px-4 rounded-full ${
                                    currentPage === number ? 'bg-purple-700 text-white' : 'bg-gray-300 text-black'
                                } hover:bg-purple-800 transition-colors duration-300 ease-in-out`}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                </div>
                {isModalOpen && selectedPlace && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg w-1/2 relative">
                            <div className="relative h-56 w-full sm:h-52">
                                <img
                                    src={
                                        selectedPlace.part === 'BAND'
                                            ? 'https://source.unsplash.com/random/800x400/?band'
                                            : 'https://source.unsplash.com/random/800x400/?Dance'
                                    }
                                    alt={selectedPlace.name}
                                    className="object-cover w-full h-full rounded-lg"
                                />
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute right-2 top-2 text-white bg-black rounded-full p-2"
                                    aria-label="닫기"
                                >
                                    <IoMdClose size={20} />
                                </button>
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-bold mb-4">{selectedPlace.name}</h2>
                                <span className="break-keep rounded-sm bg-gray-100 px-1 text-gray-500 dark:bg-gray-300 dark:text-gray-600">
                                    {selectedPlace.part}
                                </span>
                                <div className="my-2 flex w-full items-center justify-start gap-3">
                                    <button
                                        className="bg-purple-700 text-white py-2 px-4 rounded-full"
                                        onClick={() => {
                                            window.open(
                                                `https://map.kakao.com/link/to/${selectedPlace.name},${selectedPlace.coordinate.latitude},${selectedPlace.coordinate.longitude}`,
                                                '_blank'
                                            );
                                        }}
                                    >
                                        길찾기
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white py-2 px-4 rounded-full"
                                        onClick={() => {
                                            navigator.clipboard.writeText(selectedPlace.address);
                                            alert('주소가 복사되었습니다.');
                                        }}
                                    >
                                        주소 복사
                                    </button>
                                </div>
                                <hr className="w-90 my-4 h-px bg-gray-300" />
                                <div className="my-4 flex flex-col gap-4">
                                    <div className="flex items-center gap-2 align-middle">
                                        <FaMapPin size={16} className="text-gray-400" />
                                        <span>{selectedPlace.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 align-middle">
                                        <FaClock size={14} className="text-gray-400" />
                                        <span>공연 가능 시간: {selectedPlace.performanceHours}</span>
                                    </div>
                                    <div className="flex items-center gap-2 align-middle">
                                        <FaPhoneAlt size={15} className="text-gray-400" />
                                        <span>{selectedPlace.phoneNumber || '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 align-middle">
                                        <FaTag size={17} className="text-gray-400" />
                                        <span>대관료: {selectedPlace.rentalFee}</span>
                                    </div>
                                    <div className="flex items-center gap-2 align-middle">
                                        <FaTag size={17} className="text-gray-400" />
                                        <span>수용 인원: {selectedPlace.capacity}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="mt-4 bg-purple-700 text-white py-2 px-4 rounded-full"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg w-2/3 relative">
                            <h2 className="text-xl font-bold mb-4">공연 장소 추가</h2>
                            <div className="flex flex-col gap-4">
                                <div id="searchMap" className="w-full h-48 mb-4 relative z-0">
                                    <Map
                                        center={{ lat: 37.5665, lng: 126.978 }}
                                        style={{ width: '100%', height: '100%' }}
                                        level={5}
                                        onCreate={setSearchMap} // 검색용 지도를 위한 Map 인스턴스 저장
                                    >
                                        {searchResult && (
                                            <MapMarker
                                                position={{
                                                    lat: parseFloat(searchResult.y),
                                                    lng: parseFloat(searchResult.x),
                                                }}
                                            />
                                        )}
                                    </Map>
                                </div>
                                <input
                                    type="text"
                                    name="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="주소"
                                    className="border p-2 rounded"
                                />
                                <button
                                    onClick={handleAddressSearch}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-full mb-4"
                                >
                                    주소 검색
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={newPlace.name}
                                        onChange={handleAddPlaceChange}
                                        placeholder="공연 장소 이름"
                                        className="border p-2 rounded"
                                    />
                                    <select
                                        name="part"
                                        value={newPlace.part}
                                        onChange={handleAddPlaceChange}
                                        className="border p-2 rounded"
                                    >
                                        <option value="" selected>
                                            분야
                                        </option>
                                        <option value="BAND">밴드</option>
                                        <option value="DANCE">춤</option>
                                        <option value="VOCAL">노래</option>
                                    </select>
                                    <select
                                        name="region"
                                        value={newPlace.region}
                                        onChange={handleAddPlaceChange}
                                        className="border p-2 rounded"
                                    >
                                        <option value="" selected>
                                            지역
                                        </option>
                                        <option value="GANGNAMGU">강남구</option>
                                        <option value="GANGDONGGU">강동구</option>
                                        <option value="GANGBUKGU">강북구</option>
                                        <option value="GANGSEOGU">강서구</option>
                                        <option value="GEUMCHEONGU">금천구</option>
                                        <option value="GUROGU">구로구</option>
                                        <option value="GEUMCHEONGU">금천구</option>
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
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={newPlace.phoneNumber}
                                        onChange={handleAddPlaceChange}
                                        placeholder="전화번호"
                                        className="border p-2 rounded"
                                    />
                                    <input
                                        type="text"
                                        name="rentalFee"
                                        value={newPlace.rentalFee}
                                        onChange={handleAddPlaceChange}
                                        placeholder="대관료"
                                        className="border p-2 rounded"
                                    />
                                    <input
                                        type="text"
                                        name="capacity"
                                        value={newPlace.capacity}
                                        onChange={handleAddPlaceChange}
                                        placeholder="수용 인원"
                                        className="border p-2 rounded"
                                    />
                                    <input
                                        type="text"
                                        name="performanceHours"
                                        value={newPlace.performanceHours}
                                        onChange={handleAddPlaceChange}
                                        placeholder="공연 가능 시간"
                                        className="border p-2 rounded"
                                    />
                                    <input
                                        type="text"
                                        name="description"
                                        value={newPlace.description}
                                        onChange={handleAddPlaceChange}
                                        placeholder="설명"
                                        className="border p-2 rounded"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="bg-gray-500 text-white py-2 px-4 rounded-full"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={handleAddPlaceSubmit}
                                        className="bg-blue-500 text-white py-2 px-4 rounded-full"
                                    >
                                        추가
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PerformancePlace;
