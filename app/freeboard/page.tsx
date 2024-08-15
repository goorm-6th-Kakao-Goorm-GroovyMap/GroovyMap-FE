'use client';

import React, { useState } from 'react';
import PostList from './postlist';
import { IoMdSearch } from 'react-icons/io';

const FreeBoard: React.FC = () => {
    const [searchWord, setSearchWord] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
    };

    return (
        <main className="main-container flex min-h-screen bg-purple-50 flex-col items-center p-6 ">
            <div className="content flex-1 w-full max-w-4xl">
                {/* 검색창 */}
                <div className="flex justify-center items-center mb-6">
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="w-full border rounded p-2 pl-10"
                            placeholder="검색어를 입력하세요..."
                            value={searchWord}
                            onChange={handleSearchChange}
                        />
                        <div className="absolute left-3 top-3 text-gray-400">
                            <IoMdSearch size={20} />
                        </div>
                    </div>
                </div>
                {/* 메뉴이름*/}
                <header className="header mb-6">
                    <h1 className="text-2xl font-bold text-purple-700">자유게시판</h1>
                </header>
                <PostList searchWord={searchWord} />
            </div>
        </main>
    );
};

export default FreeBoard;
