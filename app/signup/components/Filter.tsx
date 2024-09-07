'use client';
import React, { ChangeEvent } from 'react';

interface FilterProps {
    selectedRegion: string;
    selectedPart: string;
    selectedSubPart: string;
    onRegionChange: (region: string) => void;
    onPartChange: (part: string) => void;
    onSubPartChange: (subPart: string) => void;
}

// 한국어와 영어 매핑
const regionMap: { [key: string]: string } = {
    ALL: '전체',
    GANGNAMGU: '강남구',
    GANGDONGGU: '강동구',
    GANGBUKGU: '강북구',
    GANGSEOGU: '강서구',
    GEUMCHEONGU: '금천구',
    GUROGU: '구로구',
    DOBONGGU: '도봉구',
    DONGDAEMUNGU: '동대문구',
    DONGJAKGU: '동작구',
    MAPOGU: '마포구',
    SEODAEMUNGU: '서대문구',
    SEOCHOGU: '서초구',
    SEONGDONGGU: '성동구',
    SEONGBUKGU: '성북구',
    SONGPA: '송파구',
    YANGCHEONGU: '양천구',
    YEONGDEUNGPOGU: '영등포구',
    YONGSANGU: '용산구',
    EUNPYEONGGU: '은평구',
    JONGNOGU: '종로구',
    JUNGGU: '중구',
    JUNGNANGGU: '중랑구',
};

const partMap: { [key: string]: string } = {
    all: '전체',
    BAND: '밴드',
    DANCE: '댄스',
    VOCAL: '보컬',
};

const subPartMap: { [key: string]: string } = {
    GUITAR: '기타',
    KEYBOARD: '건반',
    BASS: '베이스',
    VOCAL: '보컬',
    HIPHOP: '힙합',
    JAZZ: '재즈',
    LOCKING: '락킹',
};

const regions = Object.keys(regionMap);
const parts = Object.keys(partMap);
const subParts: { [key: string]: string[] } = {
    BAND: ['GUITAR', 'KEYBOARD', 'BASS', 'VOCAL'],
    DANCE: ['HIPHOP', 'JAZZ', 'LOCKING'],
    VOCAL: ['VOCAL'],
};

const Filter: React.FC<FilterProps> = ({
    selectedRegion,
    selectedPart,
    selectedSubPart,
    onRegionChange,
    onPartChange,
    onSubPartChange,
}) => {
    const handleRegionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const region = regions.find((key) => regionMap[key] === value) || '';
        onRegionChange(region);
    };

    const handlePartChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const part = parts.find((key) => partMap[key] === value) || '';
        onPartChange(part);
    };

    const handleSubPartChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const subPart = Object.keys(subPartMap).find((key) => subPartMap[key] === value) || '';
        onSubPartChange(subPart);
    };

    return (
        <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
            <div className="flex items-center flex-grow gap-2">
                <div className="flex items-center border rounded-lg p-2 bg-white">
                    <label className="font-bold mr-2">지역</label>
                    <select
                        className="border-none p-2 bg-white"
                        value={regionMap[selectedRegion] || ''}
                        onChange={handleRegionChange}
                    >
                        {regions.map((region) => (
                            <option key={region} value={regionMap[region]}>
                                {regionMap[region]}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center border rounded-lg p-2 bg-white">
                    <label className="font-bold mr-2">유형</label>
                    <select
                        className="border-none p-2 bg-white"
                        value={partMap[selectedPart] || ''}
                        onChange={handlePartChange}
                    >
                        {parts.map((part) => (
                            <option key={part} value={partMap[part]}>
                                {partMap[part]}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedPart !== 'all' && subParts[selectedPart]?.length > 0 && (
                    <div className="flex items-center border rounded-lg p-3 bg-white flex-grow">
                        <label className="font-bold mr-2 flex-shrink-0">세부 유형</label>
                        <select
                            className="border-none bg-white w w-full"
                            value={subPartMap[selectedSubPart] || ''}
                            onChange={handleSubPartChange}
                        >
                            <option value="">선택하세요</option>
                            {subParts[selectedPart].map((subPart) => (
                                <option key={subPart} value={subPartMap[subPart]}>
                                    {subPartMap[subPart]}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Filter;
