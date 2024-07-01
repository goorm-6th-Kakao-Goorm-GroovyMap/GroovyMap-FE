'use client';

import { Place } from '@/types/types';

type UpdateMarkersProps<T extends Place> = {
    places: T[];
    map: any;
    clusterer: any;
    setMarkers: React.Dispatch<React.SetStateAction<any[]>>;
    fetchPlaceDetails: (id: number) => Promise<void>;
    setSelectedPlace: React.Dispatch<React.SetStateAction<T | null>>;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const markerImages: { [key: string]: string } = {
    BAND: '/guitar.svg',
    DANCE: '/guitar.svg',
    VOCAL: '/guitar.svg',
    default: '/guitar.svg',
};

export const updateMarkers = <T extends Place>({
    places,
    map,
    clusterer,
    setMarkers,
    fetchPlaceDetails,
    setSelectedPlace,
    setIsModalOpen,
}: UpdateMarkersProps<T>) => {
    const bounds = new window.kakao.maps.LatLngBounds();

    const newMarkers = places.map((place) => {
        const markerCoordinate = new window.kakao.maps.LatLng(place.coordinate.latitude, place.coordinate.longitude);
        bounds.extend(markerCoordinate);

        const markerImage = new window.kakao.maps.MarkerImage(
            markerImages[place.part] || markerImages.default,
            new window.kakao.maps.Size(24, 35),
            { offset: new window.kakao.maps.Point(12, 35) }
        );

        const marker = new window.kakao.maps.Marker({
            position: markerCoordinate,
            image: markerImage,
        });

        const infowindow = new window.kakao.maps.InfoWindow({
            content: ` <div style="padding:5px;">
            <strong>${place.name}</strong>
            <br>
            <span>${place.part}</span>
        </div>`,
        });

        window.kakao.maps.event.addListener(marker, 'mouseover', () => {
            infowindow.open(map, marker);
        });

        window.kakao.maps.event.addListener(marker, 'mouseout', () => {
            infowindow.close();
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
            setSelectedPlace(place);
            setIsModalOpen(true);
            fetchPlaceDetails(place.id as number);
        });

        marker.setMap(map); // 마커를 지도에 추가

        return marker;
    });

    // 클러스터러가 null이 아닌 경우에만 clear 메서드를 호출
    if (clusterer) {
        clusterer.clear(); // 이전 마커 클러스터 제거
        clusterer.addMarkers(newMarkers); // 새로운 마커 클러스터 추가
    } else {
        console.error('Clusterer is null');
    }

    setMarkers((prevMarkers) => {
        prevMarkers.forEach((marker) => marker?.setMap(null)); // 이전 마커 제거
        return newMarkers;
    });

    if (!bounds.isEmpty()) {
        map.setBounds(bounds);
    }
};
