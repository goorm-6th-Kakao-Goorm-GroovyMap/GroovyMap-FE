'use client';

import React, { ChangeEvent } from 'react';
import { useRecoilState } from 'recoil';
import { signUpState, userState } from '@/recoil/state/signupState';
import Filter from '../components/Filter';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';

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
    ROCKING: '락킹',
};

const NicknameRegionPartPage: React.FC = () => {
    const [formData, setFormData] = useRecoilState(signUpState);
    const [user, setUser] = useRecoilState(userState);
    const router = useRouter();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRegionChange = (region: string) => {
        setFormData((prevState) => ({
            ...prevState,
            region,
        }));
    };

    const handlePartChange = (part: string) => {
        setFormData((prevState) => ({
            ...prevState,
            part,
            subPart: '',
        }));
    };

    const handleSubPartChange = (subPart: string) => {
        setFormData((prevState) => ({
            ...prevState,
            subPart,
        }));
    };

    const signupMutation = useMutation({
        mutationFn: async () => {
            const response = await apiClient.post('/register', {
                email: formData.email,
                password: formData.password,
                nickname: formData.nickname,
                region: regionMap[formData.region], // 한국어 값을 영어로 변환
                part: partMap[formData.part], // 한국어 값을 영어로 변환
                type: subPartMap[formData.subPart], // 한국어 값을 영어로 변환
            });
            return response.data;
        },
        onSuccess: () => {
            setUser(data.user);
            toast.success('회원가입에 성공했습니다!');
            confetti({
                particleCount: 100,
                spread: 160,
            });
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        },
        onError: (error: any) => {
            toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
        },
    });

    const handleSignUp = () => {
        if (
            !formData.nickname ||
            !formData.region ||
            !formData.part ||
            (formData.part !== '보컬' && !formData.subPart)
        ) {
            toast.warning('모든 필드를 입력해 주세요.');
            return;
        }
        signupMutation.mutate();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">회원가입 - 추가 정보</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-2">닉네임</label>
                        <input
                            type="text"
                            name="nickname"
                            placeholder="닉네임을 입력하세요"
                            value={formData.nickname}
                            onChange={handleInputChange}
                            className="w-full p-3 border rounded-lg"
                            required
                        />
                    </div>
                    <Filter
                        selectedRegion={formData.region}
                        selectedPart={formData.part}
                        selectedSubPart={formData.subPart}
                        onRegionChange={handleRegionChange}
                        onPartChange={handlePartChange}
                        onSubPartChange={handleSubPartChange}
                    />
                    <button
                        onClick={handleSignUp}
                        className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition"
                    >
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NicknameRegionPartPage;
