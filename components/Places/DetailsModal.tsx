/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaMapPin, FaClock, FaPhoneAlt, FaTag } from 'react-icons/fa';
import { Place } from '@/types/types';

interface DetailsModalProps {
    place: Place;
    isOpen: boolean;
    onClose: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ place, isOpen, onClose }) => {
    if (!isOpen) return null;

    const hours = (place as any).performanceHours || (place as any).practiceHours;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-1/3 relative">
                <div className="relative h-56 w-full sm:h-52">
                    {place.part === 'BAND' && (
                        <img src="/band.png" alt="Band" className="object-cover w-full h-full rounded-lg" />
                    )}
                    {place.part === 'DANCE' && (
                        <img src="/dance.png" alt="Dance" className="object-cover w-full h-full rounded-lg" />
                    )}
                    {place.part === 'VOCAL' && (
                        <img src="/vocal.png" alt="Vocal" className="object-cover w-full h-full rounded-lg" />
                    )}
                    <button
                        onClick={onClose}
                        className="absolute right-2 top-2 text-white bg-purple-700 rounded-full p-2"
                        aria-label="닫기"
                    >
                        <IoMdClose size={20} />
                    </button>
                </div>
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">{place.name}</h2>
                    <span className="break-keep rounded-sm bg-gray-100 px-1 text-gray-500 dark:bg-gray-300 dark:text-gray-600">
                        {place.part}
                    </span>
                    <div className="my-2 flex w-full items-center justify-start gap-3">
                        <button
                            className="bg-purple-700 text-white py-2 px-4 rounded-full"
                            onClick={() => {
                                window.open(
                                    `https://map.kakao.com/link/to/${place.name},${place.coordinate.latitude},${place.coordinate.longitude}`,
                                    '_blank'
                                );
                            }}
                        >
                            길찾기
                        </button>
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-full"
                            onClick={() => {
                                navigator.clipboard.writeText(place.address);
                                alert('주소가 복사되었습니다.');
                            }}
                        >
                            주소 복사
                        </button>
                    </div>
                    <hr className="w-90 my-4 h-px bg-gray-300" />
                    <div className="my-4 flex flex-col gap-4">
                        <div className="flex items-center gap-2 align-middle">
                            <FaMapPin size={16} className="text-gray-400" />
                            <span>{place.address}</span>
                        </div>
                        <div className="flex items-center gap-2 align-middle">
                            <FaClock size={14} className="text-gray-400" />
                            <span>운영 시간: {hours}</span>
                        </div>
                        <div className="flex items-center gap-2 align-middle">
                            <FaPhoneAlt size={15} className="text-gray-400" />
                            <span>{place.phoneNumber || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2 align-middle">
                            <FaTag size={17} className="text-gray-400" />
                            <span>대관료: {place.rentalFee}</span>
                        </div>
                        <div className="flex items-center gap-2 align-middle">
                            <FaTag size={17} className="text-gray-400" />
                            <span>수용 인원: {place.capacity}</span>
                        </div>
                        <div className="flex items-center gap-2 align-middle">
                            <FaTag size={17} className="text-gray-400" />
                            <span>설명: {place.description}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsModal;
