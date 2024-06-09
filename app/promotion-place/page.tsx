'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { IoMdSearch } from 'react-icons/io'
import { FaRegEdit } from 'react-icons/fa'
import { FaMapLocationDot } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
import PostItem from './post/postItem'
import Modal from './post/postmodal'

interface Post {
    id: number
    userImage: string
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

const areas: Record<string, { name: string; lat: number; lng: number }> = {
    ALL: { name: '서울 전체', lat: 37.5665, lng: 126.978 },
    YONGSANGU: { name: '용산구', lat: 37.5326, lng: 126.9906 },
    GANGNAMGU: { name: '강남구', lat: 37.4979, lng: 127.0276 },
    JONGNOGU: { name: '종로구', lat: 37.5729, lng: 126.9793 },
    GANGDONGGU: { name: '강동구', lat: 37.5301, lng: 127.1238 },
    GANGBUKGU: { name: '강북구', lat: 37.6396, lng: 127.0254 },
    GANGSEOGU: { name: '강서구', lat: 37.5509, lng: 126.8495 },
    GEUMCHEONGU: { name: '금천구', lat: 37.4569, lng: 126.8956 },
    GUROGU: { name: '구로구', lat: 37.4955, lng: 126.8874 },
    DOBONGGU: { name: '도봉구', lat: 37.6688, lng: 127.0468 },
    DONGDAEMUNGU: { name: '동대문구', lat: 37.5744, lng: 127.0396 },
    DONGJAKGU: { name: '동작구', lat: 37.5124, lng: 126.9392 },
    MAPOGU: { name: '마포구', lat: 37.5637, lng: 126.9084 },
    SEODAEMUNGU: { name: '서대문구', lat: 37.5791, lng: 126.9368 },
    SEOCHOGU: { name: '서초구', lat: 37.4836, lng: 127.0327 },
    SEONGDONGGU: { name: '성동구', lat: 37.5635, lng: 127.0364 },
    SEONGBUKGU: { name: '성북구', lat: 37.5894, lng: 127.0167 },
    SONGPAGU: { name: '송파구', lat: 37.5145, lng: 127.1067 },
    YANGCHEONGU: { name: '양천구', lat: 37.5244, lng: 126.8563 },
    YEONGDEUNGPOGU: { name: '영등포구', lat: 37.526, lng: 126.8963 },
    EUNPYEONGGU: { name: '은평구', lat: 37.6176, lng: 126.9227 },
    JUNGGU: { name: '중구', lat: 37.5633, lng: 126.9978 },
    JUNGNANGGU: { name: '중랑구', lat: 37.6063, lng: 127.0924 },
}

const parts: Record<string, { name: string }> = {
    ALL: { name: '전체' },
    BAND: { name: '밴드' },
    MUSIC: { name: '음악' },
    DANCE: { name: '춤' },
}

const markerImages: { [key in 'BAND' | 'MUSIC' | 'DANCE']: string } = {
    BAND: '/guitar.svg',
    MUSIC: '/guitar.svg',
    DANCE: '/guitar.svg',
}

declare global {
    interface Window {
        kakao: any
    } //후에 따로 빼주기
}

export default function PromotionPlace() {
    const [showMap, setShowMap] = useState(false) //지도버튼
    const [selectedArea, setSelectedArea] = useState('ALL') //지역기본설정
    const [selectedType, setSelectedType] = useState<'ALL' | 'BAND' | 'MUSIC' | 'DANCE'>('ALL') //유형기본설정
    const [showModal, setShowModal] = useState(false) //게시글 상세보기
    const [selectedPost, setSelectedPost] = useState<Post | null>(null) //게시글
    const [posts, setPosts] = useState<Post[]>([]) // 게시글 상태
    const [currentPage, setCurrentPage] = useState(1) // 현재 페이지
    const postsPerPage = 9 // 페이지당 게시글 수
    const mapRef = useRef<any>(null)
    const router = useRouter()

    const handleMapButtonClick = () => {
        setShowMap(!showMap)
    }

    const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedArea(e.target.value)
    }

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value as 'ALL' | 'BAND' | 'MUSIC' | 'DANCE'
        setSelectedType(selectedValue)
    }

    const handlePostClick = (post: Post) => {
        setSelectedPost(post)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedPost(null)
    }

    const handleWriteButtonClick = () => {
        router.push('/promotion-place/write')
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

    const addMarkersToMap = (map: any, posts: Post[]): void => {
        posts.forEach((post) => {
            const markerPosition = new window.kakao.maps.LatLng(post.coordinates.latitude, post.coordinates.longitude)
            const markerImage = new window.kakao.maps.MarkerImage(
                markerImages[post.part as 'BAND' | 'MUSIC' | 'DANCE'], // 타입 명시
                new window.kakao.maps.Size(24, 35),
            )
            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
                image: markerImage,
            })
            marker.setMap(map)
        })
    }

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
                        addMarkersToMap(map, posts)
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
                addMarkersToMap(map, posts)
            }
        }
    }, [showMap, selectedArea, posts, initializeMap])

    useEffect(() => {
        if (mapRef.current && !showMap) {
            mapRef.current = null
        }
    }, [showMap])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/promotionboard')
                const data = await response.json()
                const processedData = data.map((post: any) => ({
                    ...post,
                    userImage: post.userImage || '', // 로그인 기능 구현 전 임시 데이터
                    author: post.author || 'Anonymous', // 로그인 기능 구현 전 임시 데이터
                }))
                setPosts(processedData)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [])

    const filteredPosts = posts.filter((post) => {
        const areaMatch = selectedArea === 'ALL' || post.region === selectedArea
        const typeMatch = selectedType === 'ALL' || post.part === selectedType
        return areaMatch && typeMatch
    })

    // 현재 페이지에 해당하는 게시글 계산
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

    // 페이지 번호 계산
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
                {/* 게시판 필터링 부분 */}
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
                            {/* 지도 버튼 */}
                            <button
                                className="bg-purple-700 rounded-lg text-white py-2 px-4"
                                onClick={handleMapButtonClick}
                            >
                                <FaMapLocationDot />
                            </button>
                            {/* 게시글 작성 버튼 */}
                            <button
                                className="bg-purple-700 rounded-lg text-white py-2 px-4"
                                onClick={handleWriteButtonClick}
                            >
                                <FaRegEdit />
                            </button>
                        </div>
                    </div>
                    {/* 지도 표시 부분 */}
                    {showMap && <div className="w-full h-96 border m-2" id="map"></div>}
                    {/* 게시판 내용 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {currentPosts.map((post) => (
                            <div key={post.id} onClick={() => handlePostClick(post)}>
                                <PostItem
                                    userImage={post.userImage}
                                    userName={post.author}
                                    title={post.title}
                                    fileNames={post.fileNames}
                                    initialLikesCount={0}
                                    initialSavesCount={0}
                                />
                            </div>
                        ))}
                    </div>
                    {/* 페이지네이션 */}
                    <div className="flex justify-center mt-6">
                        {pageNumbers.map((number) => (
                            <button
                                key={number}
                                className={`px-3 py-1 border rounded ${currentPage === number ? 'bg-purple-700 text-white' : 'bg-white text-purple-700'}`}
                                onClick={() => handlePageChange(number)}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                </section>
            </div>
            <Modal show={showModal} onClose={handleCloseModal} post={selectedPost} />
        </div>
    )
}
