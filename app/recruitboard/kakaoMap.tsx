import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/apiClient';
import { regionCenters } from './types';

declare global {
    interface Window {
        kakao: any;
    }
}

interface Post {
    id: number;
    title: string;
    author: string;
    content: string;
    field: string;
    part: string;
    region: string;
    recruitNum: number;
    timestamp: string;
    viewCount: number;
}

const KakaoMap: React.FC = () => {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [map, setMap] = useState<any>(null);
    const [clusterer, setClusterer] = useState<any>(null);
    const [customOverlay, setCustomOverlay] = useState<any>(null);
    const appkey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await apiClient.get('/recruitboard');
                setPosts(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=clusterer,services&autoload=false`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById('map');
                const options = {
                    center: new window.kakao.maps.LatLng(regionCenters.SEOUL.lat, regionCenters.SEOUL.lng),
                    level: 9,
                };
                const mapInstance = new window.kakao.maps.Map(container, options);

                const clustererInstance = new window.kakao.maps.MarkerClusterer({
                    map: mapInstance,
                    averageCenter: true,
                    minLevel: 1,
                    disableClickZoom: true,
                    minClusterSize: 1,
                    styles: [
                        {
                            width: '40px',
                            height: '40px',
                            background: 'rgba(0, 0, 255, .5)',
                            borderRadius: '20px',
                            color: '#fff',
                            textAlign: 'center',
                            lineHeight: '40px',
                            fontSize: '16px',
                        },
                    ],
                });

                setMap(mapInstance);
                setClusterer(clustererInstance);

                window.kakao.maps.event.addListener(clustererInstance, 'clusterclick', function (cluster: any) {
                    const clusterMarkers = cluster.getMarkers();
                    const clusterPosts: Post[] = [];

                    clusterMarkers.forEach((marker: any) => {
                        const regionPosts = posts.filter((post) => post.region === marker.getTitle());
                        regionPosts.forEach((post) => {
                            if (!clusterPosts.some((p) => p.id === post.id)) {
                                clusterPosts.push(post);
                            }
                        });
                    });

                    showCustomOverlay(clusterPosts);
                });
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [appkey, posts]);

    const showCustomOverlay = (regionPosts: Post[]) => {
        setCustomOverlay({
            regionPosts: regionPosts,
        });
    };

    const hideCustomOverlay = () => {
        setCustomOverlay(null);
    };

    useEffect(() => {
        if (map && clusterer && posts.length > 0) {
            const markers = posts
                .map((post: Post) => {
                    const region = regionCenters[post.region];
                    if (!region) return null;

                    const marker = new window.kakao.maps.Marker({
                        position: new window.kakao.maps.LatLng(region.lat, region.lng),
                        title: post.region,
                    });

                    return marker;
                })
                .filter((marker) => marker !== null);

            clusterer.clear();
            clusterer.addMarkers(markers);
        }
    }, [map, clusterer, posts]);

    const navigateToPost = (postId: number) => {
        router.push(`/recruitboard/${postId}`);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
            <div id="map" style={{ width: '100%', height: '100%' }} />

            {customOverlay && (
                <div
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        background: '#ffffff',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        padding: '10px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        zIndex: 9999,
                    }}
                >
                    <h3>팀원모집 게시글</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {customOverlay.regionPosts.map((post: Post) => (
                            <li
                                key={post.id}
                                style={{ cursor: 'pointer', marginBottom: '5px' }}
                                onClick={() => navigateToPost(post.id)}
                            >
                                {post.title}
                            </li>
                        ))}
                    </ul>
                    <button onClick={hideCustomOverlay} style={{ marginTop: '10px' }}>
                        닫기
                    </button>
                </div>
            )}
        </div>
    );
};

export default KakaoMap;
