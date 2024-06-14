'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Place } from '@/types/types';
import { regions, regionNames, Region } from '@/constants/region';

declare global {
    interface Window {
        daum: any;
    }
}

interface AddModalProps<T extends Place> {
    isOpen: boolean;
    onClose: () => void;
    selectedRegion: Region;
    onSubmit: (newPlace: Omit<T, 'id'>) => void;
    kakaoRestApiKey: string;
    newPlace: Omit<T, 'id'>;
    setNewPlace: React.Dispatch<React.SetStateAction<Omit<T, 'id'>>>;
}

const markerImages: { [key: string]: string } = {
    BAND: '/guitar.svg',
    DANCE: '/guitar.svg',
    VOCAL: '/guitar.svg',
    default: '/guitar.svg',
};

//제네릭
const AddModal = <T extends Place>({
    isOpen,
    onClose,
    onSubmit,
    kakaoRestApiKey,
    newPlace,
    setNewPlace,
    selectedRegion,
}: AddModalProps<T>) => {
    const [address, setAddress] = useState('');
    const [searchMap, setSearchMap] = useState<any>(null);
    const [searchMarkers, setSearchMarkers] = useState<any[]>([]);
    const [showPostcodePopup, setShowPostcodePopup] = useState(false);
    const [searchResult, setSearchResult] = useState<any>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const handlePostcodeComplete = useCallback(
        (data: any) => {
            const fullAddress = data.address;
            const roadAddress = data.roadAddress || '';
            const jibunAddress = data.jibunAddress || '';

            setAddress(fullAddress);
            setNewPlace((prev) => ({
                ...prev,
                address: fullAddress,
            }));

            const encodedAddress = encodeURIComponent(roadAddress || jibunAddress);
            axios
                .get(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodedAddress}`, {
                    headers: { Authorization: `KakaoAK ${kakaoRestApiKey}` },
                })
                .then((response) => {
                    if (response.data.documents.length > 0) {
                        const result = response.data.documents[0];
                        const latitude = parseFloat(result.y);
                        const longitude = parseFloat(result.x);
                        const markerCoordinate = new window.kakao.maps.LatLng(latitude, longitude);

                        const markerImage = new window.kakao.maps.MarkerImage(
                            markerImages[newPlace.part] || markerImages.default,
                            new window.kakao.maps.Size(24, 35),
                            { offset: new window.kakao.maps.Point(12, 35) }
                        );

                        const marker = new window.kakao.maps.Marker({
                            position: markerCoordinate,
                            map: searchMap,
                            image: markerImage,
                        });

                        searchMarkers.forEach((marker) => marker?.setMap(null));
                        setSearchMarkers([marker]);

                        searchMap?.setCenter(markerCoordinate);
                        setNewPlace((prev) => ({
                            ...prev,
                            coordinate: {
                                latitude,
                                longitude,
                            },
                        }));
                    } else {
                        toast.error('입력한 주소를 찾을 수 없습니다. 다른 주소로 다시 시도해주세요.');
                    }
                })
                .catch((error) => {
                    toast.error('주소를 검색하는 중 에러가 발생했습니다. 나중에 다시 시도해주세요.');
                });

            setShowPostcodePopup(false);
        },
        [kakaoRestApiKey, newPlace.part, searchMap, searchMarkers, setNewPlace]
    );

    const handleAddressSearch = () => {
        setShowPostcodePopup(true);
    };

    useEffect(() => {
        if (showPostcodePopup) {
            const popupElement = document.createElement('div');
            popupElement.id = 'postcode-popup';
            document.body.appendChild(popupElement);

            new window.daum.Postcode({
                oncomplete: handlePostcodeComplete,
                onclose: () => setShowPostcodePopup(false),
            }).open();

            return () => {
                const postcodePopupElement = document.getElementById('postcode-popup');
                if (postcodePopupElement) {
                    postcodePopupElement.remove();
                }
            };
        }
    }, [handlePostcodeComplete, showPostcodePopup]);

    const handleAddPlaceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'latitude' || name === 'longitude') {
            setNewPlace((prev) => ({
                ...prev,
                coordinate: {
                    ...prev.coordinate,
                    [name]: parseFloat(value),
                },
            }));
        } else {
            setNewPlace((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddPlaceSubmit = () => {
        if (!newPlace.name || !newPlace.part || !newPlace.region || !newPlace.address) {
            toast.warning('연습 장소 이름, 분야, 지역, 주소는 필수 입력 항목입니다.');
            return;
        }
        onSubmit(newPlace);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-2/3 relative">
                <h2 className="text-xl font-bold mb-4">공연 장소 추가</h2>
                <div className="flex flex-col gap-4">
                    <div id="searchMap" className="w-full h-48 mb-4 relative z-0">
                        <Map
                            center={{ lat: 37.5665, lng: 126.978 }}
                            style={{ width: '100%', height: '100%' }}
                            level={5}
                            onCreate={setSearchMap}
                        >
                            {searchResult && (
                                <MapMarker
                                    key={searchResult.address_name}
                                    position={{
                                        lat: parseFloat(searchResult.y),
                                        lng: parseFloat(searchResult.x),
                                    }}
                                />
                            )}
                        </Map>
                    </div>
                    <input
                        type="text"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="주소"
                        className="border p-2 rounded"
                    />
                    <button
                        onClick={handleAddressSearch}
                        className="bg-blue-500 text-white py-2 px-4 rounded-full mb-4"
                    >
                        주소 검색
                    </button>

                    {showPostcodePopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg w-1/3 relative">
                                <div id="postcode-popup" />
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="name"
                            value={newPlace.name as string}
                            onChange={handleAddPlaceChange}
                            placeholder="장소 이름"
                            className="border p-2 rounded"
                        />
                        <select
                            name="part"
                            value={newPlace.part as string}
                            onChange={handleAddPlaceChange}
                            className="border p-2 rounded"
                        >
                            <option value="">전체</option>
                            <option value="BAND">밴드</option>
                            <option value="DANCE">댄스</option>
                            <option value="VOCAL">노래</option>
                        </select>
                        <select
                            name="region"
                            value={newPlace.region as string}
                            onChange={handleAddPlaceChange}
                            className="border p-2 rounded"
                        >
                            {Object.entries(regions).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={newPlace.phoneNumber as string}
                            onChange={handleAddPlaceChange}
                            placeholder="전화번호"
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="rentalFee"
                            value={newPlace.rentalFee as string}
                            onChange={handleAddPlaceChange}
                            placeholder="대관료"
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="capacity"
                            value={newPlace.capacity as string}
                            onChange={handleAddPlaceChange}
                            placeholder="수용 인원"
                            className="border p-2 rounded"
                        />
                        {'performanceHours' in newPlace && (
                            <input
                                type="text"
                                name="performanceHours"
                                value={newPlace.performanceHours as string}
                                onChange={handleAddPlaceChange}
                                placeholder="공연 가능 시간"
                                className="border p-2 rounded"
                            />
                        )}
                        {'practiceHours' in newPlace && (
                            <input
                                type="text"
                                name="practiceHours"
                                value={newPlace.practiceHours as string}
                                onChange={handleAddPlaceChange}
                                placeholder="연습 가능 시간"
                                className="border p-2 rounded"
                            />
                        )}
                        <input
                            type="text"
                            name="description"
                            value={newPlace.description as string}
                            onChange={handleAddPlaceChange}
                            placeholder="설명"
                            className="border p-2 rounded"
                        />
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded-full">
                            취소
                        </button>
                        <button
                            onClick={handleAddPlaceSubmit}
                            className="bg-blue-500 text-white py-2 px-4 rounded-full"
                        >
                            추가
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddModal;
