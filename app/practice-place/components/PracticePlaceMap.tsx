'use client';

import React, { useEffect, useState } from 'react';
import { Map, MapTypeControl, MapMarker, ZoomControl, MarkerClusterer } from 'react-kakao-maps-sdk';
import { v4 as uuidv4 } from 'uuid';
import { PracticePlace } from '@/types/types';

//지도 분야별 마커 이미지
const markerImages: { [key: string]: string } = {
    BAND: '/guitar.svg',
    DANCE: '/guitar.svg',
    VOCAL: '/guitar.svg',
    default: '/guitar.svg',
};

interface PracticePlaceMapProps {
    places: PracticePlace[];
    map: any;
    setMap: (map: any) => void;
    fetchPlaceDetails: (postId: number) => void;
    setClusterer: (clusterer: any) => void;
}

const PracticePlaceMap: React.FC<PracticePlaceMapProps> = ({
    places,
    map,
    setMap,
    fetchPlaceDetails,
    setClusterer,
}) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=clusterer`;
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
    }, [setMap, setClusterer]);

    return (
        <div id="map" className="w-full h-96 relative z-0">
            <Map
                center={{ lat: 37.5665, lng: 126.978 }}
                style={{ width: '100%', height: '100%' }}
                level={5}
                onCreate={setMap}
            >
                <MarkerClusterer>
                    {places.map((place) => {
                        const latitude = place.coordinate?.latitude;
                        const longitude = place.coordinate?.longitude;

                        if (latitude !== undefined && longitude !== undefined && place.id !== undefined) {
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
                    })}
                </MarkerClusterer>
                <MapTypeControl position="TOPRIGHT" />
                <ZoomControl position="RIGHT" />
            </Map>
        </div>
    );
};

export default PracticePlaceMap;
