'use client'

import React, { useState, ChangeEvent } from 'react'
import { IoMdSearch } from 'react-icons/io'

export default function Write() {
    const [selectedType, setSelectedType] = useState('all')
    const [positions, setPositions] = useState(['전체'])

    const positionOptions: { [key: string]: string[] } = {
        all: ['전체'],
        band: ['기타', '드럼', '베이스', '키보드'],
        music: ['보컬', '작곡', '작사'],
        dance: ['댄서', '안무가'],
    }

    const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value
        setSelectedType(type)
        setPositions(positionOptions[type])
    }

    return (
        <div className="content p-6 bg-purple-50 min-h-screen">
            <div className="content flex-1 w-full max-w-4xl mx-auto">
                {/* 검색창 */}
                <div className="flex justify-center items-center mb-6">
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="w-full border rounded p-2 pl-10"
                            placeholder="검색어를 입력하세요..."
                        />
                        <div className="absolute left-3 top-3 text-gray-400">
                            <IoMdSearch size={20} />
                        </div>
                    </div>
                </div>
                {/* 메뉴이름 */}
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-purple-700">홍보게시판</h1>
                </header>
                {/* 글쓰기 작성 폼 */}
                <form className="p-6 rounded border border-gray-300">
                    <div className="mb-4">
                        <label className="font-bold mb-2" htmlFor="title">
                            제목
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="w-full border rounded p-2"
                            placeholder="제목을 입력하세요..."
                        />
                    </div>
                    <div className="flex items-center rounded-lg mb-4">
                        <label className="font-bold mr-2">지역</label>
                        <select className="border-none rounded p-2 bg-white">
                            <option value="all">전체</option>
                            <option value="강남구">강남구</option>
                        </select>
                    </div>
                    <div className="flex items-center rounded-lg mb-4">
                        <label className="font-bold mr-2">유형</label>
                        <select className="border-none rounded p-2 bg-white" onChange={handleTypeChange}>
                            <option value="all">전체</option>
                            <option value="band">밴드</option>
                            <option value="music">음악</option>
                            <option value="dance">춤</option>
                        </select>
                        <label className="font-bold ml-2 mr-2">포지션</label>
                        <select className="border-none rounded p-2 bg-white">
                            {positions.map((position) => (
                                <option key={position} value={position}>
                                    {position}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="font-bold mb-2" htmlFor="file">
                            미디어 업로드
                        </label>
                        <p className="text-red-400">사진 또는 동영상 하나만 업로드 가능합니다.</p>
                        <input type="file" id="file" className="w-full bg-white p-2" />
                    </div>
                    <div className="mb-4">
                        <label className="font-bold mb-2" htmlFor="content">
                            내용
                        </label>
                        <textarea
                            id="content"
                            className="w-full border rounded p-2"
                            placeholder="내용을 입력하세요..."
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-purple-700 text-white font-bold py-2 px-4 rounded">
                            업로드
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
