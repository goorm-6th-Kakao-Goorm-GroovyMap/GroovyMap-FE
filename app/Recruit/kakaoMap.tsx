'use client';
import { useEffect } from 'react';
import Head from 'next/head';

interface Location {
    lat: number;
    lng: number;
}

interface KakaoMapProps {
    locations: Location[];
}

const KakaoMap: React.FC<KakaoMapProps> = ({ locations }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
        script.onload = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById('map');
                const options = {
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                    level: 3,
                };
                const map = new window.kakao.maps.Map(container, options);

                locations.forEach((location) => {
                    const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng);
                    const marker = new window.kakao.maps.Marker({
                        position: markerPosition,
                    });
                    marker.setMap(map);
                });
            });
        };
        document.head.appendChild(script);
    }, [locations]);

    return (
        <div>
            <Head>
                <title>Kakao Map</title>
            </Head>
            <div id="map" style={{ width: '400px', height: '400px' }}></div>
        </div>
    );
};

export default KakaoMap;
