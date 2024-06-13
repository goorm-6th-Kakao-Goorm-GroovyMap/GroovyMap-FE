'use client';

import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PracticePlace } from '@/types/types';

interface PracticePlaceListProps {
    places: PracticePlace[];
    currentPage: number;
    itemsPerPage: number;
    handlePageChange: (pageNumber: number) => void;
    handleTitleClick: (latitude: number, longitude: number) => void;
    fetchPlaceDetails: (postId: number) => void;
}

const PracticePlaceList: React.FC<PracticePlaceListProps> = ({
    places,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleTitleClick,
    fetchPlaceDetails,
}) => {
    //페이지네이션
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = places.slice(indexOfFirstItem, indexOfLastItem);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(places.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mt-6">
            <ul className="space-y-4">
                {currentItems.map((place) => (
                    <li key={uuidv4()} className="border p-4 rounded-lg bg-white shadow-md">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="rounded-ml bg-gray-100 px-1 text-gray-500 dark:bg-gray-300 dark:text-gray-600">
                                    {place.part}
                                </span>
                                <h3
                                    className="text-xl my-1 font-semibold cursor-pointer"
                                    onClick={() =>
                                        handleTitleClick(place.coordinate.latitude, place.coordinate.longitude)
                                    }
                                >
                                    {place.name}
                                </h3>
                                <p className="text-m text-gray-600 font-regular">{place.address}</p>
                            </div>
                            <button
                                onClick={() => fetchPlaceDetails(place.id as number)}
                                className="bg-purple-700 text-white py-2 px-4 rounded-full hover:bg-purple-800 transition-colors duration-300 ease-in-out"
                            >
                                상세 정보
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="flex justify-center space-x-2 mt-4">
                {pageNumbers.map((number) => (
                    <button
                        key={uuidv4()}
                        onClick={() => handlePageChange(number)}
                        className={`py-2 px-4 rounded-full ${
                            currentPage === number ? 'bg-purple-700 text-white' : 'bg-gray-300 text-black'
                        } hover:bg-purple-800 transition-colors duration-300 ease-in-out`}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PracticePlaceList;
