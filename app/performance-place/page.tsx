'use client';

import React, { useEffect, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { FaMapLocationDot } from 'react-icons/fa6';
import { Map, MapTypeControl, MapMarker, ZoomControl, MarkerClusterer } from 'react-kakao-maps-sdk';

interface Location {
    id: number;
    name: string;
    type: 'band' | 'music' | 'dance';
    position: { lat: number; lng: number };
    region: 'yongsan' | 'gangnam';
}

const locations: Location[] = [
    { id: 1, name: '공연장소 1', type: 'band', position: { lat: 37.5665, lng: 126.978 }, region: 'yongsan' },
    { id: 2, name: '공연장소 2', type: 'music', position: { lat: 37.5651, lng: 126.98955 }, region: 'yongsan' },
    { id: 3, name: '연습장소 1', type: 'dance', position: { lat: 37.5705, lng: 126.982 }, region: 'yongsan' },
    { id: 4, name: '공연장소 3', type: 'band', position: { lat: 37.4979, lng: 127.0276 }, region: 'gangnam' },
];

const regionCoordinates = {
    yongsan: { lat: 37.5326, lng: 126.9901 },
    gangnam: { lat: 37.4979, lng: 127.0276 },
    all: { lat: 37.5665, lng: 126.978 },
};

const markerImages = {
    band: '/guitar.svg',
    music: '/guitar.svg',
    dance: '/guitar.svg',
    default: '/guitar.svg',
};

const PerformancePlace: React.FC = () => {
    const [selectedRegion, setSelectedRegion] = useState<'all' | 'yongsan' | 'gangnam'>('all');
    const [selectedType, setSelectedType] = useState<'all' | 'band' | 'music' | 'dance'>('all');
    const [map, setMap] = useState<any>(null);

    const filteredLocations = locations.filter(
        (location) =>
            (selectedRegion === 'all' || location.region === selectedRegion) &&
            (selectedType === 'all' || location.type === selectedType)
    );

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

            filteredLocations.forEach((location) => {
                const markerPosition = new window.kakao.maps.LatLng(location.position.lat, location.position.lng);
                bounds.extend(markerPosition);

                const markerImage = new window.kakao.maps.MarkerImage(
                    location.type === 'band'
                        ? markerImages.band
                        : location.type === 'music'
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

            if (!bounds.isEmpty()) {
                map.setBounds(bounds);
            }
        }
    }, [map, filteredLocations]);

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
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value as 'all' | 'band' | 'music' | 'dance')}
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
                <div id="map" className="w-full h-96">
                    <Map
                        center={{ lat: 37.5665, lng: 126.978 }}
                        style={{ width: '100%', height: '100%' }}
                        level={5}
                        onCreate={setMap}
                    >
                        <MarkerClusterer>
                            {filteredLocations.map((location) => (
                                <MapMarker
                                    key={location.id}
                                    position={location.position}
                                    image={{
                                        src:
                                            location.type === 'band'
                                                ? markerImages.band
                                                : location.type === 'music'
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
                                />
                            ))}
                        </MarkerClusterer>
                        <MapTypeControl position="BOTTOMLEFT" />
                        <ZoomControl position="RIGHT" />
                    </Map>
                </div>
            </div>
        </div>
    );
};

export default PerformancePlace;
