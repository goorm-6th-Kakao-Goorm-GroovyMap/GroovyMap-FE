'use client';

import { useState, useEffect } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { FaRegEdit } from 'react-icons/fa';
import { FaMapLocationDot } from 'react-icons/fa6';

const locations = [
    { id: 1, name: '공연장소 1', type: 'band', position: { lat: 37.5665, lng: 126.978 }, region: 'yongsan' },
    { id: 2, name: '공연장소 2', type: 'music', position: { lat: 37.5651, lng: 126.98955 }, region: 'yongsan' },
    { id: 3, name: '연습장소 1', type: 'dance', position: { lat: 37.5705, lng: 126.982 }, region: 'yongsan' },
];

const PerformancePlace = () => {
    const [selectedRegion, setSelectedRegion] = useState('yongsan');
    const [selectedType, setSelectedType] = useState('all');

    const filteredLocations = locations.filter(
        (location) =>
            (selectedRegion === 'all' || location.region === selectedRegion) &&
            (selectedType === 'all' || location.type === selectedType)
    );

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=bba46f1c846d3637002085cbbabf5730&autoload=false`;
        script.onload = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById('map');
                const mapOption = {
                    center: new window.kakao.maps.LatLng(37.5665, 126.978),
                    level: 5,
                };
                const map = new window.kakao.maps.Map(mapContainer, mapOption);

                filteredLocations.forEach((location) => {
                    const markerPosition = new window.kakao.maps.LatLng(location.position.lat, location.position.lng);
                    const markerImage = new window.kakao.maps.MarkerImage(
                        location.type === 'band'
                            ? '/path/to/band-icon.svg'
                            : location.type === 'music'
                              ? '/path/to/music-icon.svg'
                              : '/path/to/dance-icon.svg', // 각 타입에 맞는 아이콘 설정
                        new window.kakao.maps.Size(24, 35), // 아이콘 크기
                        { offset: new window.kakao.maps.Point(12, 35) } // 아이콘 위치
                    );
                    const marker = new window.kakao.maps.Marker({
                        position: markerPosition,
                        image: markerImage,
                    });

                    const infowindow = new window.kakao.maps.InfoWindow({
                        content: `<div style="padding:5px;">${location.name}</div>`,
                    });

                    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
                        infowindow.open(map, marker);
                    });

                    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                        infowindow.close();
                    });

                    marker.setMap(map);
                });
            });
        };
        document.head.appendChild(script);
    }, [selectedRegion, selectedType]);

    return (
        <div className="content p-6 bg-purple-50 min-h-screen">
            <div className="content flex-1 w-full max-w-4xl mx-auto">
                <div className="flex justify-center items-center mb-6">
                    <div className="relative w-full max-w-md">
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
                    <h1 className="text-2xl font-bold text-purple-700">공연 장소</h1>
                </header>
                <div className="flex flex-wrap justify-between items-center mb-6 space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center border rounded-lg p-2 bg-white">
                            <label className="font-bold mr-2">지역</label>
                            <select
                                className="border-none p-2 bg-white"
                                onChange={(e) => setSelectedRegion(e.target.value)}
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
                                onChange={(e) => setSelectedType(e.target.value)}
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
                            <FaMapLocationDot />
                        </button>
                    </div>
                </div>
                <div id="map" className="w-full h-96"></div>
            </div>
        </div>
    );
};

export default PerformancePlace;
