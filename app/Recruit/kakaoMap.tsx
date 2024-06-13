'use client';

import { useEffect, useState } from 'react';
import { Map, MarkerClusterer } from 'react-kakao-maps-sdk'; // react-kakao-maps-sdk에서 필요한 모듈만 import
import { regionCenters } from './types';

interface Location {
    lat: number;
    lng: number;
    name: string;
}

interface Post {
    id: number;
    region: string;
    title: string;
}

interface KakaoMapProps {
    isVisible: boolean;
    posts: Post[];
}

const KakaoMap: React.FC<KakaoMapProps> = ({ isVisible, posts }) => {
    const [mapInstance, setMapInstance] = useState<any>(null); // 맵 인스턴스를 상태로 관리

    useEffect(() => {
        let script: HTMLScriptElement | null = null;

        if (isVisible) {
            script = document.createElement('script');
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services,clusterer&autoload=false`;
            script.onload = () => {
                window.kakao.maps.load(() => {
                    const container = document.getElementById('map');
                    if (container) {
                        const map = new window.kakao.maps.Map(container, {
                            center: new window.kakao.maps.LatLng(37.5665, 126.978),
                            level: 10,
                        });

                        const clusterer = new window.kakao.maps.MarkerClusterer({
                            map: map,
                            averageCenter: true,
                            minLevel: 5,
                        });

                        const newLocations: Location[] = [];
                        const markers = posts.map((post) => {
                            const location = {
                                lat: regionCenters[post.region].lat,
                                lng: regionCenters[post.region].lng,
                                name: post.region,
                            };
                            newLocations.push(location);

                            const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng);
                            const marker = new window.kakao.maps.Marker({
                                position: markerPosition,
                            });

                            return marker;
                        });

                        setMapInstance(map); // 맵 인스턴스 설정
                        clusterer.addMarkers(markers);
                    }
                });
            };
            document.head.appendChild(script);
        }

        return () => {
            if (script) {
                document.head.removeChild(script); // 스크립트 제거
            }
            if (mapInstance) {
                // 맵 인스턴스가 있으면 컴포넌트 언마운트 시 맵 제거
                mapInstance.relayout();
                mapInstance.removeAllChildren();
            }
        };
    }, [isVisible, posts, mapInstance]);

    if (!isVisible) return null;

    return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default KakaoMap;
