'use client';

import React, { useEffect, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { FaMapLocationDot } from 'react-icons/fa6';
import { IoMdSearch } from 'react-icons/io';
import KakaoMap from './kakaoMap';
import Recruit_post from './Recruit_post';
import WritePostForm from './WritePostForm';
import { type Post, type Comment, type Location, regionCenters, FieldPositionMapping } from './types';
import PostContent from './Post/post';
import { useParams } from 'next/navigation';

const Recruit_page: React.FC = () => {
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [isWriting, setIsWriting] = useState(false);
    const [isPosting, setIsPosting] = useState(true);
    const [selectedPost, setSelectedPost] = useState<number | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
    const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
    const [selectedField, setSelectedField] = useState<string>('');
    const [selectedPosition, setSelectedPosition] = useState<string>('');
    const { postId } = useParams<{ postId: string }>();
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const formData = new FormData();
                formData.append('postId', postId);

                const response = await fetch(`/recruitboard/${postId}`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPosts();
    }, [postId]);

    useEffect(() => {
        if (selectedPost !== null) {
            const fetchComments = async () => {
                try {
                    const formData = new FormData();
                    formData.append('postId', selectedPost.toString());

                    const response = await fetch(`/recruitboard/${selectedPost}/comment`, {
                        method: 'POST',
                        body: formData,
                    });
                    const data = await response.json();
                    setComments((prev) => ({ ...prev, [selectedPost]: data }));
                } catch (error) {
                    console.error(error);
                }
            };

            fetchComments();
        }
    }, [selectedPost]);

    useEffect(() => {
        const locations: Location[] = posts
            .map((post) => {
                const center = regionCenters[post.region as keyof typeof regionCenters];
                if (center) {
                    return {
                        name: center.name,
                        lat: center.lat,
                        lng: center.lng,
                    };
                }
                return null;
            })
            .filter((location): location is Location => location !== null);

        setLocations(locations);
    }, [posts]);

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

    const handleGoBack = () => {
        setSelectedPost(null);
    };

    const handleAddComment = async (postId: number, author: string, content: string) => {
        try {
            const formData = new FormData();
            formData.append('author', author);
            formData.append('content', content);

            const response = await fetch(`/recruitboard/${postId}/comment`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const newComment = await response.json();
                setComments((prev) => ({
                    ...prev,
                    [postId]: [...(prev[postId] || []), newComment],
                }));
            } else {
                console.error(response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const region = e.target.value;
        setSelectedRegion(region === 'ALL' ? 'ALL' : region);
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const field = e.target.value;
        setSelectedField(field);
        setSelectedPosition('');
    };

    const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const position = e.target.value;
        setSelectedPosition(position);
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
                    <h1 className="text-2xl font-bold text-purple-700">팀원모집 게시판</h1>
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
                                <select className="border-none p-2 bg-white" onChange={handleRegionChange}>
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
                            <div
                                className="flex items-center border rounded-lg p-2 bg-white"
                                style={{ borderRadius: '10px' }}
                            >
                                <label className="font-bold mr-2">분야</label>
                                <select className="border-none p-2 bg-white" onChange={handleFieldChange}>
                                    <option value="ALL">전체</option>
                                    <option value="BAND">밴드</option>
                                    <option value="DANCE">댄스</option>
                                    <option value="VOCAL">노래</option>
                                </select>
                            </div>
                            <div
                                className="flex items-center border rounded-lg p-2 bg-white"
                                style={{ borderRadius: '10px' }}
                            >
                                <label className="font-bold mr-2">포지션</label>
                                <select
                                    className="border-none p-2 bg-white"
                                    onChange={handlePositionChange}
                                    disabled={!selectedField}
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
                    <KakaoMap isVisible={isMapVisible} posts={posts} />
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
                    {isWriting && <WritePostForm postId={postId} setPosts={setPosts} />}
                </section>
            </div>
        </main>
    );
};

export default Recruit_page;
