'use client';

import React, { useEffect } from 'react';
import { Map as KakaoMap, MapTypeControl, MapMarker, ZoomControl, MarkerClusterer } from 'react-kakao-maps-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Place } from '@/types/types';

interface MapProps {
    places: Place[];
    map: any;
    setMap: (map: any) => void;
    clusterer: any;
    setClusterer: (clusterer: any) => void;
    fetchPlaceDetails: (postId: number) => void;
    kakaoMapApiKey: string;
}

//지도위의 마커
const markerImages: { [key: string]: string } = {
    BAND: '/guitar.svg',
    DANCE: '/guitar.svg',
    VOCAL: '/guitar.svg',
    default: '/guitar.svg',
};

const Map: React.FC<MapProps> = ({
    places,
    map,
    setMap,
    clusterer,
    setClusterer,
    fetchPlaceDetails,
    kakaoMapApiKey,
}) => {
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
    }, [setMap, setClusterer, kakaoMapApiKey]);

    return (
        <div id="map" className="w-full h-96 relative z-0">
            <KakaoMap
                center={{ lat: 37.5665, lng: 126.978 }}
                style={{ width: '100%', height: '100%' }}
                level={5}
                onCreate={setMap}
            >
                {Array.isArray(places) && (
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
                )}
                <MapTypeControl position="TOPRIGHT" />
                <ZoomControl position="RIGHT" />
            </KakaoMap>
        </div>
    );
};

export default Map;
