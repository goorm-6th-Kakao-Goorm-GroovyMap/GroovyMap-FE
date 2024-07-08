// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useRecoilValue } from 'recoil';
// import { postState } from '@/recoil/state/userState';
// import { regionCenters } from './types';
// import { DateTime } from 'luxon';

// declare global {
//     interface Window {
//         kakao: any;
//     }
// }

// interface Post {
//     id: number;
//     title: string;
//     author: string;
//     content: string;
//     field: string;
//     part: string;
//     region: string;
//     recruitNum: number;
//     date: DateTime;
//     viewCount: number;
// }

// const KakaoMap: React.FC = () => {
//     const router = useRouter();
//     const posts = useRecoilValue(postState);
//     const [map, setMap] = useState<any>(null);
//     const [clusterer, setClusterer] = useState<any>(null);

//     useEffect(() => {
//         const script = document.createElement('script');
//         script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=clusterer&autoload=false`;
//         script.async = true;
//         document.head.appendChild(script);

//         script.onload = () => {
//             window.kakao.maps.load(() => {
//                 const container = document.getElementById('map');
//                 const options = {
//                     center: new window.kakao.maps.LatLng(regionCenters.SEOUL.lat, regionCenters.SEOUL.lng),
//                     level: 3,
//                 };
//                 const mapInstance = new window.kakao.maps.Map(container, options);

//                 const clustererInstance = new window.kakao.maps.MarkerClusterer({
//                     map: mapInstance,
//                     averageCenter: true,
//                     minLevel: 10,
//                 });

//                 setMap(mapInstance);
//                 setClusterer(clustererInstance);
//             });
//         };

//         return () => {
//             document.head.removeChild(script);
//         };
//     }, []);

//     useEffect(() => {
//         if (map && clusterer && posts.length > 0) {
//             const markers = posts.map((post: Post) => {
//                 const region = regionCenters[post.region]; // 게시글의 지역 정보 가져오기
//                 const marker = new window.kakao.maps.Marker({
//                     position: new window.kakao.maps.LatLng(region.lat, region.lng),
//                 }    );

//                 window.kakao.maps.event.addListener(marker, 'click', () => {
//                     router.push(`/freeboard/${post.id}`);
//                 });

//                 return marker;
//             });

//             clusterer.clear();
//             clusterer.addMarkers(markers);
//         }
//     }, [map, clusterer, posts]);

//     return <div id="map" style={{ width: '100%', height: '400px' }} />;
// };

// export default KakaoMap;
