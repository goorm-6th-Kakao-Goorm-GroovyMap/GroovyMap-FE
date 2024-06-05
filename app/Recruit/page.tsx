'use client';

import React, { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { FaMapLocationDot } from 'react-icons/fa6';
import { IoMdSearch } from 'react-icons/io';
import KakaoMap from './kakaoMap';
import Recruit_post from './Recruit_post';
import WritePostForm from './WritePostForm';
import type { Post, Comment } from './types';
import PostContent from './Post/post';

const Recruit_page: React.FC = () => {
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [isWriting, setIsWriting] = useState(false);
    const [isPosting, setIsPosting] = useState(true);
    const [selectedPost, setSelectedPost] = useState<number | null>(null);
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: '첫번째 게시글',
            author: '장유태',
            content: '내용',
            region: '마포구',
            position: '기타',
            recruit_num: 2,
            date: '2024-06-04',
            views: 101,
        },
    ]);
    const [comments, setComments] = useState<{ [key: number]: Comment[] }>({
        1: [{ id: 1, author: '익', content: '123' }],
    });
    const toggleMapVisibility = () => {
        setIsMapVisible((prev) => !prev);
    };

    const toggleWriting = () => {
        setIsWriting((prev) => !prev);
        setIsPosting((prev) => !prev);
    };

    const handlePostClick = (postId: number) => {
        setSelectedPost(postId);
    };

    const handleAddComment = (postId: number, author: string, content: string) => {
        setComments((prev) => ({
            ...prev,
            [postId]: [...(prev[postId] || []), { id: Date.now(), author, content }],
        }));
    };

    const handleGoBack = () => {
        setSelectedPost(null);
    };

    return (
        <main className="main-container flex min-h-screen flex-col items-center p-6">
            <div className="content flex-1 w-full max-w-4xl">
                {/* 검색창 */}
                <div className="flex justify-center items-center mb-6">
                    <div className="relative w-full max-w-md">
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
                {/* 메뉴이름*/}
                <header className="header mb-6">
                    <h1 className="text-2xl font-bold text-purple-700">홍보게시판</h1>
                </header>
                {/* 게시판 필터링부분 */}
                <section className="mb-6">
                    <div className="flex flex-wrap justify-between items-center mb-6 space-x-4">
                        <div className="flex items-center space-x-2">
                            <div
                                className="flex items-center border rounded-lg p-2 bg-white"
                                style={{ borderRadius: '10px' }}
                            >
                                <label className="font-bold mr-2">지역</label>
                                <select className="border-none p-2 bg-white">
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
                            <div
                                className="flex items-center border rounded-lg p-2 bg-white"
                                style={{ borderRadius: '10px' }}
                            >
                                <label className="font-bold mr-2">분야</label>
                                <select className="border-none p-2 bg-white">
                                    <option value="">전체</option>
                                    <option value="음악">음악</option>
                                    <option value="연극">연극</option>
                                    <option value="댄스">댄스</option>
                                    <option value="미술">미술</option>
                                    <option value="영화">영화</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="bg-purple-700 text-white py-2 px-4" onClick={toggleMapVisibility}>
                                <FaMapLocationDot />
                            </button>
                            <button className="bg-purple-700 text-white py-2 px-4" onClick={toggleWriting}>
                                <FaRegEdit />
                            </button>
                        </div>
                    </div>
                    <KakaoMap isVisible={isMapVisible} locations={[{ lat: 33.450701, lng: 126.570667 }]} />
                    <div className="border p-4">
                        {selectedPost
                            ? isPosting && (
                                  <PostContent
                                      post={posts.find((post) => post.id === selectedPost)!}
                                      comments={comments[selectedPost] || []}
                                      addComment={handleAddComment}
                                      goBack={handleGoBack}
                                  />
                              )
                            : isPosting && <Recruit_post posts={posts} onPostClick={handlePostClick} />}
                    </div>
                    {isWriting && <WritePostForm />}
                </section>
            </div>
        </main>
    );
};

export default Recruit_page;
