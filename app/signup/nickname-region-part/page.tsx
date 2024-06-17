'use client';

import React, { ChangeEvent, useState } from 'react';
import { useRecoilState } from 'recoil';
import { signUpState } from '@/recoil/state/signupState';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import Filter from '../components/Filter';

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
    BASSE: '베이스',
    VOCAL: '보컬',
    HIPHOP: '힙합',
    JAZZ: '재즈',
    ROCKING: '락킹',
};

const NicknameRegionPartPage: React.FC = () => {
    const [formData, setFormData] = useRecoilState(signUpState);
    const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [nicknameError, setNicknameError] = useState<string | null>(null);
    const router = useRouter();

    //입력값, 닉네임 영어로만
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'nickname') {
            const regex = /^[a-zA-Z0-9_]*$/;
            if (!regex.test(value)) {
                setNicknameError('닉네임은 영어 대소문자, 숫자, 밑줄(_)만 사용할 수 있습니다.');
                return;
            } else {
                setNicknameError(null);
            }
        }
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

    //닉네임 중복 확인
    const checkNicknameAvailabilityMutation = useMutation({
        mutationFn: async () => {
            const response = await apiClient.post('/nickname-check', { nickname: formData.nickname });
            return response.data;
        },
        onSuccess: (data) => {
            setNicknameAvailable(data.available);
            if (data.available) {
                toast.success('사용 가능한 닉네임입니다.');
            } else {
                toast.error('이미 사용 중인 닉네임입니다.');
            }
        },
        onError: (error) => {
            console.error('Error checking nickname availability:', error);
            toast.error('닉네임 중복 확인 중 오류가 발생했습니다.');
            setNicknameAvailable(false);
        },
    });

    //닉네임 중복 확인 handle
    const handleCheckNickname = () => {
        if (!formData.nickname) {
            toast.warning('닉네임을 입력해 주세요.');
            return;
        }
        checkNicknameAvailabilityMutation.mutate();
    };

    //회원가입
    const signupMutation = useMutation({
        mutationFn: async () => {
            const response = await apiClient.post('/register', {
                email: formData.email,
                password: formData.password,
                nickname: formData.nickname,
                region: regionMap[formData.region],
                part: partMap[formData.part],
                type: subPartMap[formData.subPart],
            });

            return response.data;
        },
        onSuccess: (data) => {
            if (data.result) {
                toast.success('회원가입에 성공했습니다!');
                confetti({
                    //콘페티 효과
                    particleCount: 100,
                    spread: 160,
                });
                setTimeout(() => {
                    //회원가입 성공 후 로그인 페이지로 이동
                    router.push('/login');
                }, 2000);
            } else {
                toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
            }
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
        if (nicknameAvailable === null) {
            toast.warning('닉네임 중복 확인을 해주세요.');
            return;
        }
        if (nicknameAvailable === false) {
            toast.warning('닉네임이 이미 사용 중입니다.');
            return;
        }
        signupMutation.mutate();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50">
            <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">회원가입 - 추가 정보</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-2">닉네임</label>
                        <div className="flex">
                            <input
                                type="text"
                                name="nickname"
                                placeholder="닉네임을 입력하세요"
                                value={formData.nickname}
                                onChange={handleInputChange}
                                className="flex-1 p-3 border rounded-l-lg"
                                required
                            />
                            <button
                                type="button"
                                onClick={handleCheckNickname}
                                className="w-32 bg-purple-500 text-white hover:bg-purple-600 rounded-r-lg transition transform duration-300 hover:scale-105"
                            >
                                중복 확인
                            </button>
                        </div>
                        {nicknameError && <p className="text-sm text-red-500 mt-2">{nicknameError}</p>}
                        {nicknameAvailable !== null && !nicknameError && (
                            <p className={`text-sm mt-2 ${nicknameAvailable ? 'text-green-500' : 'text-red-500'}`}>
                                {nicknameAvailable ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.'}
                            </p>
                        )}
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
