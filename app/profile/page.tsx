'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { FaMapLocationDot } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import UserProfile from './user/userprofile';
import { areas, parts, markerImages } from '../../components/constants';
import { userState } from '@/recoil/state/userState';
import apiClient from '@/api/apiClient';
import { FaRegEdit } from 'react-icons/fa';

//추가사항-삭제 1인 1등록만 가능

// User 인터페이스 정의
interface User {
    id: number;
    memberId: number;
    profileImage: string;
    nickname: string;
    introduction: string;
    part: string;
    region: string;
}

// 글로벌 Window 인터페이스에 kakao 속성 추가
declare global {
    interface Window {
        kakao: any;
    }
}

export default function ProfilePage() {
    // useState를 사용하여 상태 관리
    const [showMap, setShowMap] = useState(false);
    const [selectedArea, setSelectedArea] = useState('ALL');
    const [selectedType, setSelectedType] = useState<'ALL' | 'BAND' | 'VOCAL' | 'DANCE'>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const profilesPerPage = 9;
    const mapRef = useRef<any>(null);
    const router = useRouter();
    const queryClient = useQueryClient();
    const user = useRecoilValue(userState);

    // 프로필을 가져오는 함수 정의
    const fetchProfiles = async (): Promise<User[]> => {
        const response = await apiClient.get('/profile');
        return response.data.map((profile: User) => ({
            ...profile,
            profileImage: profile.profileImage,
        }));
    };

    // React Query를 사용하여 프로필 데이터를 가져옴
    const {
        data: profiles = [],
        error,
        isLoading,
    } = useQuery<User[], Error>({
        queryKey: ['profiles'],
        queryFn: fetchProfiles,
    });

    // 프로필 추가를 위한 뮤테이션 정의
    const mutation = useMutation<User, Error>({
        mutationFn: async () => {
            const response = await apiClient.post('/profile/add');
            return response.data;
        },
        onSuccess: (data) => {
            // 성공 시 프로필 목록을 갱신하고 확인 메시지 숨김
            queryClient.invalidateQueries({
                queryKey: ['profiles'],
            });
            setShowConfirmation(false);
        },
    });
    // 프로필 추가 핸들러
    const handleAddProfile = () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            router.push('/login');
            return;
        }
        mutation.mutate();
    };

    // 지도 버튼 클릭 핸들러
    const handleMapButtonClick = () => {
        setShowMap(!showMap);
    };

    // 지역 선택 변경 핸들러
    const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedArea(e.target.value);
    };

    // 타입 선택 변경 핸들러
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value as 'ALL' | 'BAND' | 'VOCAL' | 'DANCE';
        setSelectedType(selectedValue);
    };

    // 프로필 클릭 핸들러
    const handleProfileClick = (profile: User) => {
        router.push(`/mypage/${profile.memberId}`);
    };

    // 지도를 초기화하는 함수
    const initializeMap = useCallback((): any => {
        if (!mapRef.current) {
            const container = document.getElementById('map');
            const options = {
                center: new window.kakao.maps.LatLng(areas[selectedArea].lat, areas[selectedArea].lng),
                level: selectedArea === 'ALL' ? 8 : 4,
            };
            const kakaoMap = new window.kakao.maps.Map(container, options);
            mapRef.current = kakaoMap;
            return kakaoMap;
        }
        return mapRef.current;
    }, [selectedArea]);

    // 지도에 마커를 추가하는 함수
    const addMarkersToMap = useCallback(
        (map: any, profiles: User[]): void => {
            if (map.customOverlays) {
                map.customOverlays.forEach((overlay: any) => overlay.setMap(null));
            }

            if (map.markers) {
                map.markers.forEach((marker: any) => marker.setMap(null));
            }

            map.customOverlays = [];
            map.markers = [];

            const filteredProfiles = profiles.filter((profile) => {
                const typeMatch = selectedType === 'ALL' || profile.part.includes(selectedType);
                return typeMatch;
            });

            const groupedProfiles = filteredProfiles.reduce((acc: any, profile) => {
                const region = profile.region;
                if (!acc[region]) {
                    acc[region] = [];
                }
                acc[region].push(profile);
                return acc;
            }, {});

            Object.keys(groupedProfiles).forEach((region) => {
                const profilesInRegion = groupedProfiles[region];
                const area = areas[region];
                const content = `<div style="padding:5px;z-index:1;background:white;border:1px solid black;">${profilesInRegion
                    .map((profile: User) => `<div>${profile.nickname}</div>`)
                    .join('')}</div>`;

                const position = new window.kakao.maps.LatLng(area.lat, area.lng);
                const markerImage = new window.kakao.maps.MarkerImage(
                    markerImages[selectedType],
                    new window.kakao.maps.Size(24, 35)
                );
                const marker = new window.kakao.maps.Marker({
                    position,
                    image: markerImage,
                });

                const customOverlay = new window.kakao.maps.CustomOverlay({
                    position,
                    content,
                    yAnchor: 1,
                    zIndex: 3,
                });

                window.kakao.maps.event.addListener(marker, 'mouseover', () => {
                    customOverlay.setMap(map);
                });

                window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                    customOverlay.setMap(null);
                });

                marker.setMap(map);
                map.markers.push(marker);
                map.customOverlays.push(customOverlay);
            });
        },
        [selectedType]
    );

    // 지도 표시 상태 변경에 따른 효과 처리
    useEffect(() => {
        if (showMap) {
            if (!mapRef.current) {
                const script = document.createElement('script');
                script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
                script.async = true;
                document.head.appendChild(script);

                script.onload = () => {
                    window.kakao.maps.load(() => {
                        const map = initializeMap();
                        addMarkersToMap(map, profiles || []);
                    });
                };

                return () => {
                    document.head.removeChild(script);
                };
            } else {
                const map = initializeMap();
                const moveLatLon = new window.kakao.maps.LatLng(areas[selectedArea].lat, areas[selectedArea].lng);
                map.setCenter(moveLatLon);
                map.setLevel(selectedArea === 'ALL' ? 8 : 4);
                addMarkersToMap(map, profiles || []);
            }
        }
    }, [showMap, selectedArea, selectedType, profiles, initializeMap, addMarkersToMap]);

    // 지도 숨김 상태 변경에 따른 효과 처리
    useEffect(() => {
        if (mapRef.current && !showMap) {
            mapRef.current = null;
        }
    }, [showMap]);

    // 데이터 로딩 중 상태 표시
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // 데이터 로딩 오류 상태 표시
    if (error) {
        return <div>Error fetching data: {error.message}</div>;
    }

    // 프로필 정렬 및 필터링
    const sortedProfiles = (Array.isArray(profiles) ? profiles : []).sort(
        (a, b) => b.id - a.id // id를 기준으로 최신 순으로 정렬
    );
    const filteredProfiles = sortedProfiles.filter((profile) => {
        const areaMatch = selectedArea === 'ALL' || profile.region === selectedArea;
        const typeMatch = selectedType === 'ALL' || profile.part.includes(selectedType);
        return areaMatch && typeMatch;
    });

    // 현재 페이지에 표시할 프로필 계산
    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

    // 페이지 번호 계산
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredProfiles.length / profilesPerPage); i++) {
        pageNumbers.push(i);
    }

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // 지역 이름 가져오기
    const getAreaName = (regionKey: string) => areas[regionKey]?.name || regionKey;

    // 파트 이름 가져오기
    const getPartName = (partKey: string) => parts[partKey]?.name || partKey;

    return (
        <div className='content p-6 bg-purple-50 min-h-screen'>
            <div className='content flex-1 w-full max-w-4xl mx-auto'>
                <div className='flex justify-center items-center mb-6'>
                    <div className='relative w-full'>
                        <input
                            type='text'
                            className='w-full border rounded p-2 pl-10'
                            placeholder='검색어를 입력하세요...'
                        />
                        <div className='absolute left-3 top-3 text-gray-400'>
                            <IoMdSearch size={20} />
                        </div>
                    </div>
                </div>
                <header className='mb-6'>
                    <h1 className='text-2xl font-bold text-purple-700'>프로필 페이지</h1>
                </header>
                <section className='mb-6'>
                    <div className='flex flex-wrap justify-between items-center mb-6 space-x-4'>
                        <div className='flex items-center space-x-2'>
                            <div className='flex items-center border rounded-lg p-2 bg-white'>
                                <label className='font-bold mr-2'>지역</label>
                                <select
                                    className='border-none p-2 bg-white'
                                    value={selectedArea}
                                    onChange={handleAreaChange}
                                >
                                    {Object.keys(areas).map((key) => (
                                        <option key={key} value={key}>
                                            {areas[key].name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex items-center border rounded-lg p-2 bg-white'>
                                <label className='font-bold mr-2'>유형</label>
                                <select
                                    className='border-none p-2 bg-white'
                                    value={selectedType}
                                    onChange={handleTypeChange}
                                >
                                    {Object.keys(parts).map((key) => (
                                        <option key={key} value={key}>
                                            {parts[key].name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <button
                                className='bg-purple-700 rounded-lg text-white py-2 px-4'
                                onClick={handleMapButtonClick}
                            >
                                <FaMapLocationDot />
                            </button>
                            <button
                                className='bg-purple-700 rounded-lg text-white py-2 px-4'
                                onClick={() => {
                                    setShowMap(false);
                                    setShowConfirmation(true);
                                }}
                            >
                                <FaRegEdit />
                            </button>
                        </div>
                    </div>
                    {showMap && <div className='w-full h-96 border m-2' id='map'></div>}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {currentProfiles.map((profile) => (
                            <div key={profile.id} onClick={() => handleProfileClick(profile)}>
                                <UserProfile
                                    memberId={profile.memberId}
                                    profileImage={profile.profileImage ?? ''}
                                    nickname={profile.nickname}
                                    introduction={profile.introduction ?? ''}
                                    part={getPartName(profile.part)}
                                    region={getAreaName(profile.region)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-center mt-6'>
                        {pageNumbers.map((number) => (
                            <button
                                key={number}
                                className={`px-3 py-1 border rounded ${
                                    currentPage === number ? 'bg-purple-700 text-white' : 'bg-white text-purple-700'
                                }`}
                                onClick={() => handlePageChange(number)}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                </section>
            </div>
            {showConfirmation && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white rounded-lg p-6 w-1/2'>
                        <h2 className='text-lg font-bold mb-4'>프로필 등록</h2>
                        <p>프로필을 등록하시겠습니까?</p>
                        <div className='flex justify-end mt-4'>
                            <button
                                className='bg-gray-300 rounded-lg text-black py-2 px-4 mr-2'
                                onClick={() => setShowConfirmation(false)}
                            >
                                취소
                            </button>
                            <button className='bg-green-500 rounded-lg text-white py-2 px-4' onClick={handleAddProfile}>
                                예
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
