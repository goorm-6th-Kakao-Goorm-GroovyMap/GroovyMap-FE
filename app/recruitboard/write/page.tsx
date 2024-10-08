'use client';

import React, { useEffect, useState } from 'react';
import { FieldPositionMapping, Post } from '../types';
import apiClient from '@/api/apiClient';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/state/userState';
import { useParams, useRouter } from 'next/navigation';

const WritePostForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [region, setRegion] = useState('SEOUL');
    const [field, setField] = useState('CHOICE');
    const [part, setPart] = useState('CHOICE');
    const [members, setMembers] = useState(1);
    const [selectedField, setSelectedField] = useState<string>('');
    const currentUser = useRecoilValue(userState);
    const router = useRouter();
    const { postId } = useParams<{ postId?: string }>();

    useEffect(() => {
        if (postId) {
            // 기존 게시글을 로드하여 폼에 채워줍니다.
            const fetchPost = async () => {
                try {
                    const response = await apiClient.get(`/recruitboard/${postId}`);
                    const post = response.data;
                    setTitle(post.title);
                    setContent(post.content);
                    setRegion(post.region);
                    setField(post.field);
                    setPart(post.part);
                    setMembers(post.recruitNum);
                    setSelectedField(post.field);
                } catch (error) {
                    console.log(error);
                }
            };

            fetchPost();
        }
    }, [postId]);

    const handleMemberChange = (increment: boolean) => {
        setMembers((prev) => (increment ? prev + 1 : prev > 1 ? prev - 1 : 1));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('author', currentUser.nickname);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('region', region);
        formData.append('field', field);
        formData.append('part', part);
        formData.append('recruitNum', members.toString());
        formData.append('timestamp', new Date().toISOString());

        try {
            if (postId) {
                // 기존 게시글 수정
                await apiClient.put(`/recruitboard/${postId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // 새 게시글 작성
                const response = await apiClient.post(`/recruitboard/write`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const newPostId = response.data.id;
                router.push(`/recruitboard/${newPostId}`);
            }

            router.push(`/recruitboard/${postId || 'recruitboard'}`);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFieldValue = e.target.value;
        setField(selectedFieldValue);
        setSelectedField(selectedFieldValue);
    };

    return (
        <div>
            <button onClick={() => router.push('/recruitboard')} className="bg-gray-200 py-2 px-4 rounded mb-4">
                &lt; 뒤로가기
            </button>
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
                        <option value="SEOUL">서울 전체</option>
                        <option value="GANGNAMGU">강남구</option>
                        <option value="GANGDONGGU">강동구</option>
                        <option value="GANGBUKGU">강북구</option>
                        <option value="GANGSEOGU">강서구</option>
                        <option value="GEUMCHEONGU">금천구</option>
                        <option value="GUROGU">구로구</option>
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
                        <option value="CHOICE">선택</option>
                        <option value="BAND">밴드</option>
                        <option value="DANCE">댄스</option>
                        <option value="VOCAL">노래</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="position" className="block font-bold mb-1">
                        포지션:
                    </label>
                    <select
                        id="part"
                        className="w-full border rounded p-2"
                        value={part}
                        onChange={(e) => setPart(e.target.value)}
                    >
                        <option value="">선택</option>
                        {selectedField &&
                            Object.entries(FieldPositionMapping[selectedField]).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value}
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
        </div>
    );
};

export default WritePostForm;
