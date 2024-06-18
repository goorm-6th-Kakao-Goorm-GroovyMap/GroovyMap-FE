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

const regionMap: { [key: string]: string } = {
    전체: 'ALL',
    강남구: 'GANGNAMGU',
    강동구: 'GANGDONGGU',
    강북구: 'GANGBUKGU',
    강서구: 'GANGSEOGU',
    금천구: 'GEUMCHEONGU',
    구로구: 'GUROGU',
    도봉구: 'DOBONGGU',
    동대문구: 'DONGDAEMUNGU',
    동작구: 'DONGJAKGU',
    마포구: 'MAPOGU',
    서대문구: 'SEODAEMUNGU',
    서초구: 'SEOCHOGU',
    성동구: 'SEONGDONGGU',
    성북구: 'SEONGBUKGU',
    송파구: 'SONGPA',
    양천구: 'YANGCHEONGU',
    영등포구: 'YEONGDEUNGPOGU',
    용산구: 'YONGSANGU',
    은평구: 'EUNPYEONGGU',
    종로구: 'JONGNOGU',
    중구: 'JUNGGU',
    중랑구: 'JUNGNANGGU',
};

const partMap: { [key: string]: string } = {
    전체: 'ALL',
    밴드: 'BAND',
    댄스: 'DANCE',
    보컬: 'VOCAL',
};

const subPartMap: { [key: string]: string } = {
    기타: 'GUITAR',
    건반: 'KEYBOARD',
    베이스: 'BASS',
    보컬: 'VOCAL',
    힙합: 'HIPHOP',
    재즈: 'JAZZ',
    락킹: 'ROCKING',
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
        console.log('Updated formData:', formData); // 값 저장 확인
    };

    const handleRegionChange = (region: string) => {
        setFormData((prevState) => ({
            ...prevState,
            region,
        }));
        console.log('Selected region:', region); // 값 저장 확인
    };

    const handlePartChange = (part: string) => {
        setFormData((prevState) => ({
            ...prevState,
            part,
            subPart: '',
        }));
        console.log('Selected part:', part); // 값 저장 확인
    };

    const handleSubPartChange = (subPart: string) => {
        setFormData((prevState) => ({
            ...prevState,
            subPart,
        }));
        console.log('Selected subPart:', subPart); // 값 저장 확인
    };

    // 닉네임 중복 확인
    const checkNicknameAvailabilityMutation = useMutation({
        mutationFn: async () => {
            const response = await apiClient.post('register/nickname-check', { nickname: formData.nickname });
            return response.data;
        },
        onSuccess: (data) => {
            console.log('응답 데이터:', data); // 응답 데이터를 콘솔에 출력
            setNicknameAvailable(data.available);
            if (data.available) {
                toast.success('사용 가능한 닉네임입니다.');
            } else {
                toast.error('이미 사용 중인 닉네임입니다.');
            }
        },
        onError: (error) => {
            console.error('닉네임 중복 확인 중 오류가 발생했습니다:', error); // 오류 데이터를 콘솔에 출력
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
            const mappedRegion = regionMap[formData.region] || formData.region;
            const mappedPart = partMap[formData.part] || formData.part;
            const mappedSubPart = subPartMap[formData.subPart] || formData.subPart;
            const response = await apiClient.post('/register', {
                email: formData.email,
                password: formData.password,
                nickname: formData.nickname,
                region: mappedRegion,
                part: mappedPart,
                type: mappedSubPart,
            });

            return response.data;
        },
        onSuccess: (data) => {
            console.log('회원가입 성공 응답:', data); // 응답 데이터를 콘솔에 출력
            if (data.result) {
                toast.success('회원가입에 성공했습니다!');
                confetti({
                    // 콘페티 효과
                    particleCount: 100,
                    spread: 160,
                });
                setTimeout(() => {
                    // 회원가입 성공 후 로그인 페이지로 이동
                    router.push('/login');
                }, 2000);
            } else {
                toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
            }
        },
        onError: (error: any) => {
            console.error('회원가입 실패 응답:', error); // 오류 데이터를 콘솔에 출력
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
