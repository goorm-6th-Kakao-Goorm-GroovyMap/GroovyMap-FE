'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import { parts, types, areas } from '@/constants/constants';

interface PerformanceWritePostModalProps {
    onClose: () => void;
}

const PerformanceWritePostModal: React.FC<PerformanceWritePostModalProps> = ({ onClose }) => {
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [date, setDate] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [coordinate, setCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);
    const [showPostcodePopup, setShowPostcodePopup] = useState(false);
    const [part, setPart] = useState('');
    const [type, setType] = useState('');
    const [region, setRegion] = useState('');
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (newRecord: FormData) => {
            return await apiClient.post(`/mypage/performance/write`, newRecord, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['performanceRecords']);
            onClose();
        },
        onError: (error) => {
            console.error('Error creating performance record:', error);
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('description', description);
        formData.append('address', address);
        formData.append('date', date);
        formData.append('part', part);
        formData.append('type', type);
        formData.append('region', region);
        if (coordinate) {
            formData.append('latitude', coordinate.latitude.toString());
            formData.append('longitude', coordinate.longitude.toString());
        }
        if (image) {
            formData.append('image', image);
        }
        mutation.mutate(formData);
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const handlePostcodeComplete = useCallback((data: any) => {
        const fullAddress = data.address;
        const roadAddress = data.roadAddress || '';
        const jibunAddress = data.jibunAddress || '';

        setAddress(fullAddress);

        const encodedAddress = encodeURIComponent(roadAddress || jibunAddress);
        axios
            .get(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodedAddress}`, {
                headers: { Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}` },
            })
            .then((response) => {
                if (response.data.documents.length > 0) {
                    const result = response.data.documents[0];
                    const latitude = parseFloat(result.y);
                    const longitude = parseFloat(result.x);

                    setCoordinate({
                        latitude,
                        longitude,
                    });
                } else {
                    toast.error('입력한 주소를 찾을 수 없습니다. 다른 주소로 다시 시도해주세요.');
                }
            })
            .catch((error) => {
                toast.error('주소를 검색하는 중 에러가 발생했습니다. 나중에 다시 시도해주세요.');
            });

        setShowPostcodePopup(false);
    }, []);

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

    const filteredTypes = part && parts[part] ? parts[part].types || [] : [];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">공연 기록 추가</h2>

                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="장소를 아래 검색버튼으로 입력하세요."
                    className="w-full p-2 border rounded-lg mb-4"
                />
                <button
                    onClick={handleAddressSearch}
                    className="bg-purple-500 w-full text-white py-2 px-4 rounded mb-4"
                >
                    주소 검색
                </button>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                />
                <select
                    value={part}
                    onChange={(e) => setPart(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                >
                    <option value="">분야 선택</option>
                    {Object.keys(parts).map((key) => (
                        <option key={key} value={key}>
                            {parts[key].name}
                        </option>
                    ))}
                </select>
                {part && (
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-2 border rounded-lg mb-4"
                    >
                        <option value="">타입 선택</option>
                        {filteredTypes.map((t: string) => (
                            <option key={t} value={t}>
                                {types[t]?.name}
                            </option>
                        ))}
                    </select>
                )}
                <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                >
                    <option value="">지역 선택</option>
                    {Object.keys(areas).map((key) => (
                        <option key={key} value={key}>
                            {areas[key].name}
                        </option>
                    ))}
                </select>
                {/* 이미지는 뺌 */}
                {/* <input type="file" onChange={handleImageChange} className="mb-4" /> */}
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                    rows={4}
                    placeholder="공연 설명을 입력하세요."
                ></textarea>
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg">
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-purple-500 text-white py-2 px-4 rounded-lg"
                        disabled={mutation.isLoading}
                    >
                        {mutation.isLoading ? '등록 중...' : '등록'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PerformanceWritePostModal;
