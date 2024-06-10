'use client';

import React, { useState } from 'react';
import { FieldPositionMapping, Post } from './types';

interface WritePostFormProps {
    postId: string;
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const WritePostForm: React.FC<WritePostFormProps> = ({ postId, setPosts }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [region, setRegion] = useState('');
    const [field, setField] = useState('');
    const [position, setPosition] = useState('');
    const [members, setMembers] = useState(1);
    const [selectedField, setSelectedField] = useState<string>('');

    const handleMemberChange = (increment: boolean) => {
        setMembers((prev) => (increment ? prev + 1 : prev > 1 ? prev - 1 : 1));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        formData.append('date', new Date().toISOString().split('T')[0]);
        formData.append('views', '0');

        try {
            const response = await fetch(`/recruitboard/${postId}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const newPost = await response.json();
                setPosts((prev) => [...prev, newPost]);
            } else {
                console.error(response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFieldValue = e.target.value;
        setField(selectedFieldValue);
        setSelectedField(selectedFieldValue);
    };

    return (
        <form onSubmit={handleSubmit} className="border p-4">
            <div className="mb-4">
                <label htmlFor="title" className="block font-bold mb-1">
                    제목:
                </label>
                <input
                    type="text"
                    id="title"
                    className="w-full border rounded p-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요."
                />
            </div>

            <div className="mb-4">
                <label htmlFor="region" className="block font-bold mb-1">
                    활동지역:
                </label>
                <select
                    id="region"
                    className="w-full border rounded p-2"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                >
                    <option value="">선택하세요</option>
                    <option value="ALL">전체</option>
                    <option value="GANGNAMGU">강남구</option>
                    <option value="GANGDONGGU">강동구</option>
                    <option value="GANGBUKGU">강북구</option>
                    <option value="GANGSEOGU">강서구</option>
                    <option value="GEUMCHEONGU">금천구</option>
                    <option value="GUROGU">구로구</option>
                    <option value="GEUMCHEONGU">금천구</option>
                    <option value="DOBONGGU">도봉구</option>
                    <option value="DONGDAEMUNGU">동대문구</option>
                    <option value="DONGJAKGU">동작구</option>
                    <option value="MAPOGU">마포구</option>
                    <option value="SEODAEMUNGU">서대문구</option>
                    <option value="SEOCHOGU">서초구</option>
                    <option value="SEONGDONGGU">성동구</option>
                    <option value="SEONGBUKGU">성북구</option>
                    <option value="SONGPA">송파구</option>
                    <option value="YANGCHEONGU">양천구</option>
                    <option value="YEONGDEUNGPOGU">영등포구</option>
                    <option value="YONGSANGU">용산구</option>
                    <option value="EUNPYEONGGU">은평구</option>
                    <option value="JONGNOGU">종로구</option>
                    <option value="JUNGGU">중구</option>
                    <option value="JUNGNANGGU">중랑구</option>
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="field" className="block font-bold mb-1">
                    유형:
                </label>
                <select id="field" className="w-full border rounded p-2" value={field} onChange={handleFieldChange}>
                    <option value="">전체</option>
                    <option value="BAND">밴드</option>
                    <option value="DANCE">댄스</option>
                    <option value="VOCAL">노래</option>
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="field" className="block font-bold mb-1">
                    포지션:
                </label>
                <select
                    id="field"
                    className="w-full border rounded p-2"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                >
                    <option value="">선택 </option>
                    {selectedField &&
                        FieldPositionMapping[selectedField].map((position) => (
                            <option key={position} value={position}>
                                {position}
                            </option>
                        ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block font-bold mb-1">모집 인원:</label>
                <div className="flex items-center">
                    <button
                        type="button"
                        className="border rounded-l px-4 py-2"
                        onClick={() => handleMemberChange(false)}
                    >
                        -
                    </button>
                    <span className="border-t border-b px-4 py-2">{members}</span>
                    <button
                        type="button"
                        className="border rounded-r px-4 py-2"
                        onClick={() => handleMemberChange(true)}
                    >
                        +
                    </button>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="content" className="block font-bold mb-1">
                    내용:
                </label>
                <textarea
                    id="content"
                    className="w-full border rounded p-2"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요."
                />
            </div>
            <button type="submit" className="w-full bg-purple-700 text-white py-2 px-4 rounded">
                글쓰기
            </button>
        </form>
    );
};

export default WritePostForm;
