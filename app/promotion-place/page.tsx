'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { IoMdSearch } from 'react-icons/io'
import { FaRegEdit } from 'react-icons/fa'
import { FaMapLocationDot } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import PostItem from './post/postItem'
import Modal from './post/postmodal'
import apiClient from '@/api/apiClient'
import axios from 'axios'
import { areas, parts, markerImages } from '../../components/constants'
import { useRecoilValue } from 'recoil'
import { userState } from '@/recoil/state/userState'

//추가사항-낙관적업데이트 적용하기

interface Post {
    id: number
    profileImage: string
    author: string
    title: string
    content: string
    fileNames: string
    region: string
    part: string
    coordinates: {
        latitude: number
        longitude: number
    }
    timestamp: string
    likesCount: number
    savesCount: number
    viewCount: number
}

declare global {
    interface Window {
        kakao: any
    }
}

export default function PromotionPlace() {
    const [showMap, setShowMap] = useState(false)
    const [selectedArea, setSelectedArea] = useState('ALL')
    const [selectedType, setSelectedType] = useState<'ALL' | 'BAND' | 'VOCAL' | 'DANCE'>('ALL')
    const [showModal, setShowModal] = useState(false)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const postsPerPage = 9
    const mapRef = useRef<any>(null)
    const router = useRouter()
    const currentUser = useRecoilValue(userState)
    const [likedPosts, setLikedPosts] = useState<number[]>([])
    const [savedPosts, setSavedPosts] = useState<number[]>([])

    const fetchPosts = async (): Promise<Post[]> => {
        try {
            const response = await apiClient.get('/promotionboard')
            let data = response.data

            const baseUrl = `https://groovymap-s3-bucket.s3.ap-northeast-2.amazonaws.com/`
            return data.map((post: any) => ({
                ...post,
                profileImage: post.profileImage,
                fileNames: post.fileNames ? `${baseUrl}${post.fileNames}` : '', // fileNames를 절대 경로로 설정
            }))
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                throw new Error(`HTTP error! status: ${error.response?.status}`)
            } else {
                throw new Error(`HTTP error! status: ${error.message}`)
            }
        }
    }

    const {
        data: posts,
        error,
        isLoading,
    } = useQuery<Post[], Error>({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    })

    //지도 버튼 핸들러
    const handleMapButtonClick = () => {
        setShowMap(!showMap)
    }
    //지역 드롭다운 핸들러
    const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedArea(e.target.value)
    }
    //파트 드롭다운 핸들러
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value as 'ALL' | 'BAND' | 'VOCAL' | 'DANCE'
        setSelectedType(selectedValue)
    }
    //게시글 조회수
    const handlePostClick = async (post: Post) => {
        const updatedPost = { ...post, viewCount: post.viewCount + 1 }
        setSelectedPost(updatedPost)
        setShowModal(true)
        setShowMap(false)
        try {
            const response = await apiClient.get(`/promotionboard/${post.id}`)
            // 서버로부터 받은 최신 조회수로 상태를 업데이트합니다.
            const freshViewCount = response.data.viewCount
            setSelectedPost((prevPost) => ({
                ...prevPost!,
                viewCount: freshViewCount,
            }))
        } catch (error: any) {
            console.error(`Failed to update view count for post ${post.id}:`, error)
            const revertedPost = { ...post, viewCount: post.viewCount }
            setSelectedPost(revertedPost)
        }
    }
    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedPost(null)
    }
    //게시글 작성 버튼 핸들러
    const handleWriteButtonClick = () => {
        if (currentUser && currentUser.nickname && currentUser.profileUrl) {
            router.push('/promotion-place/write')
        } else {
            alert('로그인이 필요합니다.')
            router.push('/login') // 로그인 페이지로 이동
        }
    }
    const initializeMap = useCallback((): any => {
        if (!mapRef.current) {
            const container = document.getElementById('map')
            const options = {
                center: new window.kakao.maps.LatLng(areas[selectedArea].lat, areas[selectedArea].lng),
                level: selectedArea === 'ALL' ? 8 : 4,
            }
            const kakaoMap = new window.kakao.maps.Map(container, options)
            mapRef.current = kakaoMap
            return kakaoMap
        }
        return mapRef.current
    }, [selectedArea])

    const addMarkersToMap = useCallback(
        (map: any, posts: Post[]): void => {
            // 기존에 추가된 모든 마커 제거
            if (map.markers) {
                map.markers.forEach((marker: any) => marker.setMap(null))
            }

            // 새로운 마커 배열 초기화
            map.markers = []

            // 선택된 유형 필터링
            const filteredPosts = selectedType === 'ALL' ? posts : posts.filter((post) => post.part === selectedType)

            filteredPosts.forEach((post) => {
                const markerPosition = new window.kakao.maps.LatLng(
                    post.coordinates.latitude,
                    post.coordinates.longitude,
                )
                const markerImage = new window.kakao.maps.MarkerImage(
                    markerImages[post.part as 'BAND' | 'VOCAL' | 'DANCE'],
                    new window.kakao.maps.Size(24, 35),
                )
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                    image: markerImage,
                })
                marker.setMap(map)
                map.markers.push(marker)
            })
        },
        [selectedType],
    )

    useEffect(() => {
        if (showMap) {
            if (!mapRef.current) {
                const script = document.createElement('script')
                script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`
                script.async = true
                document.head.appendChild(script)

                script.onload = () => {
                    window.kakao.maps.load(() => {
                        const map = initializeMap()
                        addMarkersToMap(map, posts || [])
                    })
                }

                return () => {
                    document.head.removeChild(script)
                }
            } else {
                const map = initializeMap()
                const moveLatLon = new window.kakao.maps.LatLng(areas[selectedArea].lat, areas[selectedArea].lng)
                map.setCenter(moveLatLon)
                map.setLevel(selectedArea === 'ALL' ? 8 : 4)
                addMarkersToMap(map, posts || [])
            }
        }
    }, [showMap, selectedArea, selectedType, posts, initializeMap, addMarkersToMap])

    // 상태 초기화 부분 제거
    useEffect(() => {
        if (mapRef.current && !showMap) {
            mapRef.current = null
        }
    }, [showMap])

    //로그인한 유저가 좋아요와 저장하기 버튼을 누른 흔적(?)
    useEffect(() => {
        const fetchUserActivities = async () => {
            if (!currentUser) return
            try {
                const response = await apiClient.get(`/promotionboard/myList`, {
                    headers: { Authorization: `Bearer ${currentUser.token}` },
                })
                const { likePostIds, savePostIds } = response.data
                setLikedPosts(likePostIds)
                setSavedPosts(savePostIds)
            } catch (error) {
                console.error('Failed to fetch user activities:', error)
            }
        }

        fetchUserActivities()
    }, [currentUser])

    //api 연결 확인용도
    if (isLoading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error fetching data: {error.message}</div>
    }

    //최신순으로 게시물 정렬
    const sortedPosts = (posts || []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    const filteredPosts = sortedPosts.filter((post) => {
        const areaMatch = selectedArea === 'ALL' || post.region === selectedArea
        const typeMatch = selectedType === 'ALL' || post.part === selectedType
        return areaMatch && typeMatch
    })
    //게시글 최대 9개 이후는 페이지 넘어가기
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(filteredPosts.length / postsPerPage); i++) {
        pageNumbers.push(i)
    }
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }

    return (
        <div className="content p-6 bg-purple-50 min-h-screen">
            <div className="content flex-1 w-full max-w-4xl mx-auto">
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
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-purple-700">홍보게시판</h1>
                </header>
                <section className="mb-6">
                    <div className="flex flex-wrap justify-between items-center mb-6 space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center border rounded-lg p-2 bg-white">
                                <label className="font-bold mr-2">지역</label>
                                <select
                                    className="border-none p-2 bg-white"
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
                            <div className="flex items-center border rounded-lg p-2 bg-white">
                                <label className="font-bold mr-2">유형</label>
                                <select
                                    className="border-none p-2 bg-white"
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
                        <div className="flex items-center space-x-2">
                            <button
                                className="bg-purple-700 rounded-lg text-white py-2 px-4"
                                onClick={handleMapButtonClick}
                            >
                                <FaMapLocationDot />
                            </button>
                            <button
                                className="bg-purple-700 rounded-lg text-white py-2 px-4"
                                onClick={handleWriteButtonClick}
                            >
                                <FaRegEdit />
                            </button>
                        </div>
                    </div>
                    {showMap && <div className="w-full h-96 border m-2" id="map"></div>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {currentPosts.map((post) => (
                            <div key={post.id} onClick={() => handlePostClick(post)}>
                                <PostItem
                                    postId={post.id}
                                    profileImage={post.profileImage}
                                    userName={post.author}
                                    title={post.title}
                                    fileNames={post.fileNames}
                                    initialLikesCount={post.likesCount}
                                    initialSavesCount={post.savesCount}
                                    liked={likedPosts.includes(post.id)}
                                    saved={savedPosts.includes(post.id)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-6">
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
            <Modal
                show={showModal}
                onClose={handleCloseModal}
                post={selectedPost}
                liked={likedPosts.includes(selectedPost?.id || 0)} // liked 상태 전달
                saved={savedPosts.includes(selectedPost?.id || 0)} // saved 상태 전달
            />
        </div>
    )
}
