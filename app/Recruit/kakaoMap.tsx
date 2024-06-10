import { useEffect, useState } from 'react';
import { Map, MapTypeControl, MapMarker, ZoomControl, MarkerClusterer } from 'react-kakao-maps-sdk';
import { useRouter } from 'next/router';
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
    // const router = useRouter();
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        if (isVisible) {
            const script = document.createElement('script');
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

                            // window.kakao.maps.event.addListener(marker, 'click', () => {
                            //     router.push(`/recruitboard/${post.id}`);
                            // });

                            return marker;
                        });

                        setLocations(newLocations);
                        clusterer.addMarkers(markers);
                    }
                });
            };
            document.head.appendChild(script);

            return () => {
                document.getElementById('map')?.remove();
                document.head.removeChild(script);
            };
        }
    }, [isVisible, posts]);

    if (!isVisible) return null;

    return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};
export default KakaoMap;
