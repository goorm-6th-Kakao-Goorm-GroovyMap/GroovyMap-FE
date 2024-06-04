'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoMdSearch, IoMdClose } from 'react-icons/io';
import { FaMapMarkerAlt, FaMapPin, FaClock, FaPhoneAlt, FaTag } from 'react-icons/fa';
import { Map, MapTypeControl, MapMarker, ZoomControl, MarkerClusterer } from 'react-kakao-maps-sdk';

const mockPerformancePlace = [
    {
        id: 1,
        name: '공연장소 1',
        part: 'band',
        position: { lat: 37.5665, lng: 126.978 },
        region: 'yongsan',
        phoneNumber: '010-1234-5678',
        rentalFee: '50000원',
        capacity: '100명',
        description: '밴드 공연을 위한 장소입니다.',
    },
    {
        id: 2,
        name: '공연장소 2',
        part: 'music',
        position: { lat: 37.5651, lng: 126.98955 },
        region: 'yongsan',
        phoneNumber: '010-9876-5432',
        rentalFee: '60000원',
        capacity: '150명',
        description: '음악 공연을 위한 장소입니다.',
    },
];

const markerImages = {
    band: '/guitar.svg',
    music: '/guitar.svg',
    dance: '/guitar.svg',
    default: '/guitar.svg',
};

const PerformancePlace: React.FC = () => {
    const [selectedRegion, setSelectedRegion] = useState<'all' | 'yongsan' | 'gangnam'>('all');
    const [selectedPart, setSelectedPart] = useState<'all' | 'band' | 'music' | 'dance'>('all');
    const [performancePlaces, setPerformancePlaces] = useState(mockPerformancePlace);
    const [filteredPerformancePlaces, setFilteredPerformancePlaces] = useState(mockPerformancePlace);
    const [map, setMap] = useState<any>(null);
    const [selectedPlace, setSelectedPlace] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const filtered = performancePlaces.filter(
            (place) =>
                (selectedRegion === 'all' || place.region === selectedRegion) &&
                (selectedPart === 'all' || place.part === selectedPart)
        );
        setFilteredPerformancePlaces(filtered);
    }, [selectedRegion, selectedPart, performancePlaces]);

    const fetchPlaceDetails = (postId: number) => {
        const place = mockPerformancePlace.find((p) => p.id === postId);
        setSelectedPlace(place);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=bba46f1c846d3637002085cbbabf5730&autoload=false&libraries=clusterer`;
        script.onload = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById('map');
                const mapOption = {
                    center: new window.kakao.maps.LatLng(37.5665, 126.978),
                    level: 5,
                };
                const map = new window.kakao.maps.Map(mapContainer, mapOption);
                setMap(map);
            });
        };
        document.head.appendChild(script);
    }, []);

    useEffect(() => {
        if (map) {
            const bounds = new window.kakao.maps.LatLngBounds();

            filteredPerformancePlaces.forEach((place) => {
                const markerPosition = new window.kakao.maps.LatLng(place.position.lat, place.position.lng);
                bounds.extend(markerPosition);

                const markerImage = new window.kakao.maps.MarkerImage(
                    place.part === 'band'
                        ? markerImages.band
                        : place.part === 'music'
                          ? markerImages.music
                          : markerImages.dance,
                    new window.kakao.maps.Size(24, 35),
                    { offset: new window.kakao.maps.Point(12, 35) }
                );

                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
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

                marker.setMap(map);
            });

            if (!bounds.isEmpty()) {
                map.setBounds(bounds);
            }
        }
    }, [map, filteredPerformancePlaces]);

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
                                onChange={(e) => setSelectedRegion(e.target.value as 'all' | 'yongsan' | 'gangnam')}
                            >
                                <option value="all">전체</option>
                                <option value="yongsan">용산구</option>
                                <option value="gangnam">강남구</option>
                            </select>
                        </div>
                        <div className="flex items-center border rounded-lg p-2 bg-white">
                            <label className="font-bold mr-2">유형</label>
                            <select
                                className="border-none p-2 bg-white"
                                value={selectedPart}
                                onChange={(e) => setSelectedPart(e.target.value as 'all' | 'band' | 'music' | 'dance')}
                            >
                                <option value="all">전체</option>
                                <option value="band">밴드</option>
                                <option value="music">음악</option>
                                <option value="dance">춤</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="bg-purple-700 text-white py-2 px-4 rounded-full">
                            <FaMapMarkerAlt />
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
                                    position={place.position}
                                    image={{
                                        src:
                                            place.part === 'band'
                                                ? markerImages.band
                                                : place.part === 'music'
                                                  ? markerImages.music
                                                  : markerImages.dance,
                                        size: {
                                            width: 24,
                                            height: 35,
                                        },
                                        options: {
                                            offset: {
                                                x: 12,
                                                y: 35,
                                            },
                                        },
                                    }}
                                    onClick={() => fetchPlaceDetails(place.id)} // 마커 클릭 시 상세 정보 가져오기
                                />
                            ))}
                        </MarkerClusterer>
                        <MapTypeControl position="BOTTOMLEFT" />
                        <ZoomControl position="RIGHT" />
                    </Map>
                </div>
                <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-4">공연 장소 목록</h2>
                    <ul className="space-y-4">
                        {filteredPerformancePlaces.map((place) => (
                            <li key={place.id} className="border p-4 rounded-lg bg-white shadow-md">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-semibold">{place.name}</h3>
                                        <p>지역: {place.region}</p>
                                        <p>
                                            위치: {place.position.lat}, {place.position.lng}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => fetchPlaceDetails(place.id)} // 상세 정보를 가져오는 함수 호출
                                        className="bg-purple-700 text-white py-2 px-4 rounded-full"
                                    >
                                        상세 정보
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {isModalOpen && selectedPlace && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg w-1/2 relative">
                            <div className="relative h-56 w-full sm:h-52">
                                <img
                                    src={
                                        selectedPlace.part === 'band'
                                            ? '/images/band.jpg'
                                            : selectedPlace.part === 'music'
                                              ? '/images/music.jpg'
                                              : '/images/dance.jpg'
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
                                                `https://map.kakao.com/link/to/${selectedPlace.name},${selectedPlace.position.lat},${selectedPlace.position.lng}`,
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
                                        <span>개방 시간: {selectedPlace.openingHours}</span>
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
            </div>
        </div>
    );
};

export default PerformancePlace;
