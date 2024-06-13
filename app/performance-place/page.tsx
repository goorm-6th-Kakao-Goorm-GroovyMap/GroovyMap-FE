/* eslint-disable @next/next/no-img-element */ // 이미지 src 넣을 때 에러 수정하기 위해 추가
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IoMdSearch, IoMdClose } from 'react-icons/io';
import { FaMapMarkerAlt, FaMapPin, FaClock, FaPhoneAlt, FaTag, FaPlus } from 'react-icons/fa';
import { Map, MapTypeControl, MapMarker, ZoomControl, MarkerClusterer } from 'react-kakao-maps-sdk';
import { v4 as uuidv4 } from 'uuid'; // UUID import
import {
    getPerformancePlaces,
    addPerformancePlace,
    getPerformancePlaceDetails,
} from '@/api/placeApi/performancePlaceApi';
import type { PerformancePlace, PerformancePlaceResponse } from '@/types/types';

const markerImages: { [key: string]: string } = {
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
    const [selectedPart, setSelectedPart] = useState<'all' | 'BAND' | 'DANCE' | 'VOCAL'>('all');
    const [filteredPerformancePlaces, setFilteredPerformancePlaces] = useState<PerformancePlace[]>([]);
    const [map, setMap] = useState<any>(null);
    const [clusterer, setClusterer] = useState<any>(null);
    const [selectedPlace, setSelectedPlace] = useState<PerformancePlace | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [markers, setMarkers] = useState<any[]>([]);
    const [searchMap, setSearchMap] = useState<any>(null);
    const [searchMarkers, setSearchMarkers] = useState<any[]>([]);
    const [address, setAddress] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);
    const [showPostcodePopup, setShowPostcodePopup] = useState(false);
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const queryClient = useQueryClient();

    const {
        data: performancePlacesData,
        isLoading,
        isError,
        error,
    } = useQuery<PerformancePlaceResponse, Error>({
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
                // 백엔드에서 반환된 ID를 사용하여 상세 정보를 가져옴
                const newPlaceDetails = await getPerformancePlaceDetails(newPlace.id);

                queryClient.invalidateQueries({ queryKey: ['performancePlaces'] });
                setFilteredPerformancePlaces((prev) => {
                    if (Array.isArray(prev)) {
                        return [...prev, newPlaceDetails];
                    } else {
                        return [newPlaceDetails];
                    }
                }); // 새로운 장소 데이터를 배열에 추가
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

    if (!process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || !process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY) {
        throw new Error('Kakao API keys are not defined in the environment variables');
    }

    const kakaoMapApiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    const kakaoRestApiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApiKey}&autoload=false&libraries=clusterer`;
        script.onload = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById('map');
                if (mapContainer) {
                    const mapOption = {
                        center: new window.kakao.maps.LatLng(37.5665, 126.978),
                        level: 5,
                    };
                    const map = new window.kakao.maps.Map(mapContainer, mapOption);
                    setMap(map);

                    const mapTypeControl = new window.kakao.maps.MapTypeControl();
                    map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

                    const zoomControl = new window.kakao.maps.ZoomControl();
                    map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

                    const clusterer = new window.kakao.maps.MarkerClusterer({
                        map: map,
                        averageCenter: true,
                        minLevel: 10,
                    });
                    setClusterer(clusterer);
                }
            });
        };
        document.head.appendChild(script);
    }, [kakaoMapApiKey]);

    useEffect(() => {
        if (map) {
            if (Array.isArray(filteredPerformancePlaces)) {
                updateMarkers(filteredPerformancePlaces);
            } else {
                console.error('filteredPerformancePlaces is not an array:', filteredPerformancePlaces);
            }
        }
    }, [map, filteredPerformancePlaces]);

    const handleAddPlaceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'latitude' || name === 'longitude') {
            setNewPlace((prev) => ({
                ...prev,
                coordinate: {
                    ...prev.coordinate,
                    [name]: parseFloat(value),
                },
            }));
        } else {
            setNewPlace((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddPlaceSubmit = () => {
        if (!newPlace.name || !newPlace.part || !newPlace.region || !newPlace.address) {
            toast.warning('연습 장소 이름, 분야, 지역, 주소는 필수 입력 항목입니다.');
            return;
        }
        addPlaceMutation.mutate(newPlace);
    };

    useEffect(() => {
        if (map && clusterer && Array.isArray(filteredPerformancePlaces)) {
            const bounds = new window.kakao.maps.LatLngBounds();
            const newMarkers = filteredPerformancePlaces
                .map((place) => {
                    const latitude = place.coordinate?.latitude;
                    const longitude = place.coordinate?.longitude;

                    if (latitude !== undefined && longitude !== undefined && place.id !== undefined) {
                        const markerCoordinate = new window.kakao.maps.LatLng(latitude, longitude);
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
                            fetchPlaceDetails(place.id as number);
                        });

                        marker.setMap(map);
                        return marker;
                    }
                })
                .filter((marker) => marker !== undefined); // undefined가 아닌 마커들만 필터링

            setMarkers((prevMarkers) => {
                prevMarkers.forEach((marker) => marker?.setMap(null));
                return newMarkers;
            });

            clusterer?.clear();
            clusterer?.addMarkers(newMarkers);

            if (!bounds.isEmpty()) {
                map?.setBounds(bounds);
            }
        }
    }, [map, clusterer, filteredPerformancePlaces, fetchPlaceDetails]);

    const updateMarkers = (places: PerformancePlace[]) => {
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

            clusterer?.clear(); // 이전 마커 클러스터 제거
            clusterer?.addMarkers(newMarkers); // 새로운 마커 클러스터 추가

            if (!bounds.isEmpty()) {
                map?.setBounds(bounds);
            }
        }
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const handlePostcodeComplete = (data: any) => {
        const fullAddress = data.address;
        const roadAddress = data.roadAddress || '';
        const jibunAddress = data.jibunAddress || '';

        setAddress(fullAddress);
        setNewPlace((prev) => ({
            ...prev,
            address: fullAddress,
        }));

        // 주소를 좌표로 변환하여 지도에 마커를 표시
        const encodedAddress = encodeURIComponent(roadAddress || jibunAddress);
        axios
            .get(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodedAddress}`, {
                headers: { Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}` },
            })
            .then((response) => {
                if (response.data.documents.length > 0) {
                    const result = response.data.documents[0];
                    const latitude = parseFloat(result.y);
                    const longitude = parseFloat(result.x);
                    const markerCoordinate = new window.kakao.maps.LatLng(latitude, longitude);

                    const markerImage = new window.kakao.maps.MarkerImage(
                        markerImages[newPlace.part] || markerImages.default,
                        new window.kakao.maps.Size(24, 35),
                        { offset: new window.kakao.maps.Point(12, 35) }
                    );

                    const marker = new window.kakao.maps.Marker({
                        position: markerCoordinate,
                        map: searchMap,
                        image: markerImage,
                    });

                    searchMarkers.forEach((marker) => marker?.setMap(null));
                    setSearchMarkers([marker]);

                    searchMap?.setCenter(markerCoordinate);
                    setNewPlace((prev) => ({
                        ...prev,
                        coordinate: {
                            latitude,
                            longitude,
                        },
                    }));
                } else {
                    toast.error('입력한 주소를 찾을 수 없습니다. 다른 주소로 다시 시도해주세요.');
                }
            })
            .catch((error) => {
                toast.error('주소를 검색하는 중 에러가 발생했습니다. 나중에 다시 시도해주세요.');
            });

        setShowPostcodePopup(false);
    };

    const handleAddressSearch = () => {
        setShowPostcodePopup(true);
    };

    const closePostcodePopup = () => {
        setShowPostcodePopup(false);
        const postcodePopupElement = document.getElementById('postcode-popup');
        if (postcodePopupElement) {
            postcodePopupElement.remove();
        }
    };

    useEffect(() => {
        if (showPostcodePopup) {
            const popupElement = document.createElement('div');
            popupElement.id = 'postcode-popup';
            document.body.appendChild(popupElement);

            new window.daum.Postcode({
                oncomplete: handlePostcodeComplete,
                onclose: closePostcodePopup, // 팝업이 닫힐 때 상태 업데이트
            }).open();

            return () => {
                const postcodePopupElement = document.getElementById('postcode-popup');
                if (postcodePopupElement) {
                    postcodePopupElement.remove();
                }
            };
        }
    }, [showPostcodePopup]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // 추가: 지도 중심을 변경하는 함수
    const handleTitleClick = (latitude: number, longitude: number) => {
        if (map) {
            map.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
            map.setLevel(3); // 줌 레벨 설정 (작은 숫자일수록 더 확대됨)
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(filteredPerformancePlaces)
        ? filteredPerformancePlaces.slice(indexOfFirstItem, indexOfLastItem)
        : [];
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredPerformancePlaces.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

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
                <div id="map" className="w-full h-96 relative z-0">
                    <Map
                        center={{ lat: 37.5665, lng: 126.978 }}
                        style={{ width: '100%', height: '100%' }}
                        level={5}
                        onCreate={setMap}
                    >
                        <MarkerClusterer>
                            {Array.isArray(filteredPerformancePlaces) &&
                                filteredPerformancePlaces
                                    .map((place) => {
                                        const latitude = place.coordinate?.latitude;
                                        const longitude = place.coordinate?.longitude;

                                        if (
                                            latitude !== undefined &&
                                            longitude !== undefined &&
                                            place.id !== undefined
                                        ) {
                                            return (
                                                <MapMarker
                                                    key={uuidv4()}
                                                    position={{ lat: latitude, lng: longitude }}
                                                    image={{
                                                        src: markerImages[place.part] || markerImages.default,
                                                        size: { width: 24, height: 35 },
                                                        options: { offset: { x: 12, y: 35 } },
                                                    }}
                                                    onClick={() => fetchPlaceDetails(place.id as number)}
                                                />
                                            );
                                        } else {
                                            console.error('Missing coordinates or id:', place);
                                            return null;
                                        }
                                    })
                                    .filter((marker) => marker !== null)}
                        </MarkerClusterer>

                        <MapTypeControl position="TOPRIGHT" />
                        <ZoomControl position="RIGHT" />
                    </Map>
                </div>
                <div className="mt-6">
                    <ul className="space-y-4">
                        {currentItems.map((place) => (
                            <li key={uuidv4()} className="border p-4 rounded-lg bg-white shadow-md">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="rounded-ml bg-gray-100 px-1 text-gray-500 dark:bg-gray-300 dark:text-gray-600">
                                            {place.part}
                                        </span>
                                        <h3
                                            className="text-xl my-1 font-semibold cursor-pointer"
                                            onClick={() =>
                                                handleTitleClick(place.coordinate.latitude, place.coordinate.longitude)
                                            }
                                        >
                                            {place.name}
                                        </h3>
                                        <p className="text-m text-gray-600 font-regular">{place.address}</p>
                                    </div>
                                    <button
                                        // onClick 핸들러에서 place.id가 undefined가 아닌지 확인
                                        onClick={() => {
                                            if (place.id !== undefined) {
                                                fetchPlaceDetails(place.id);
                                            } else {
                                                console.error('Place id is undefined:', place);
                                            }
                                        }}
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
                                key={uuidv4()}
                                onClick={() => handlePageChange(number)}
                                className={`py-2 px-4 rounded-full ${
                                    currentPage === number ? 'bg-purple-700 text-white' : 'bg-gray-300 text-black'
                                } hover:bg-purple-800 transition-colors duration-300 ease-in-out`}
                            >
                                {number}
                            </button>
                        ))}
                        ㅌ
                    </div>
                </div>
                {isModalOpen && selectedPlace && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg w-1/3 relative">
                            <div className="relative h-56 w-full sm:h-52">
                                {selectedPlace.part === 'BAND' && (
                                    <img src="/band.png" alt="Band" className="object-cover w-full h-full rounded-lg" />
                                )}
                                {selectedPlace.part === 'DANCE' && (
                                    <img
                                        src="/dance.png"
                                        alt="Dance"
                                        className="object-cover w-full h-full rounded-lg"
                                    />
                                )}
                                {selectedPlace.part === 'VOCAL' && (
                                    <img
                                        src="/vocal.png"
                                        alt="Vocal"
                                        className="object-cover w-full h-full rounded-lg"
                                    />
                                )}
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute right-2 top-2 text-white bg-purple-700 rounded-full p-2"
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
                                    <div className="flex items-center gap-2 align-middle">
                                        <FaTag size={17} className="text-gray-400" />
                                        <span>설명: {selectedPlace.description}</span>
                                    </div>
                                </div>
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
                                                key={searchResult.address_name} // 고유한 값을 key로 사용
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

                                {showPostcodePopup && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                        <div className="bg-white p-6 rounded-lg w-1/3 relative">
                                            <div id="postcode-popup" />
                                        </div>
                                    </div>
                                )}

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
                                        <option value="">전체</option>
                                        <option value="BAND">밴드</option>
                                        <option value="DANCE">댄스</option>
                                        <option value="VOCAL">노래</option>
                                    </select>
                                    <select
                                        name="region"
                                        value={newPlace.region}
                                        onChange={handleAddPlaceChange}
                                        className="border p-2 rounded"
                                    >
                                        <option value="">전체</option>
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
                                        {/* 지역구 추가 */}
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
