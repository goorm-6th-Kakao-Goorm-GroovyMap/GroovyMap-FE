'use client';

import React, { useState } from 'react';

const WritePostForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [region, setRegion] = useState('');
    const [field, setField] = useState('');
    const [position, setPosition] = useState('');
    const [members, setMembers] = useState(1);

    const handleMemberChange = (increment: boolean) => {
        setMembers((prev) => (increment ? prev + 1 : prev > 1 ? prev - 1 : 1));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };
    const handleSubmit1 = async () => {};

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
                    <option value="전체">전체</option>
                    <option value="강남구">강남구</option>
                    <option value="강동구">강동구</option>
                    <option value="강북구">강북구</option>
                    <option value="강서구">강서구</option>
                    <option value="관악구">관악구</option>
                    <option value="광진구">광진구</option>
                    <option value="구로구">구로구</option>
                    <option value="금천구">금천구</option>
                    <option value="노원구">노원구</option>
                    <option value="도봉구">도봉구</option>
                    <option value="동대문구">동대문구</option>
                    <option value="동작구">동작구</option>
                    <option value="마포구">마포구</option>
                    <option value="서대문구">서대문구</option>
                    <option value="서초구">서초구</option>
                    <option value="성동구">성동구</option>
                    <option value="성북구">성북구</option>
                    <option value="송파구">송파구</option>
                    <option value="양천구">양천구</option>
                    <option value="영등포구">영등포구</option>
                    <option value="용산구">용산구</option>
                    <option value="은평구">은평구</option>
                    <option value="종로구">종로구</option>
                    <option value="중구">중구</option>
                    <option value="중랑구">중랑구</option>
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="field" className="block font-bold mb-1">
                    유형:
                </label>
                <select
                    id="field"
                    className="w-full border rounded p-2"
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                >
                    <option value="">선택하세요</option>
                    <option value="">전체</option>
                    <option value="음악">음악</option>
                    <option value="연극">연극</option>
                    <option value="댄스">댄스</option>
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
                    <option value="">선택하세요</option>
                    <option value="음악">기타</option>
                    <option value="연극">바코드</option>
                    <option value="댄스">노래</option>
                    <option value="미술">춤</option>
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
