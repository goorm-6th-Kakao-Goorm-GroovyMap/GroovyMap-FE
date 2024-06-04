'use client'

import { useState, useEffect, useRef } from 'react'
import { IoMdSearch } from 'react-icons/io'
import { FaRegEdit } from 'react-icons/fa'
import { FaMapLocationDot } from 'react-icons/fa6'

const areas: Record<string, { name: string; lat: number; lng: number }> = {
    seoul: { name: '서울 전체', lat: 37.5665, lng: 126.978 },
    yongsan: { name: '용산구', lat: 37.5326, lng: 126.9906 },
    gangnam: { name: '강남구', lat: 37.4979, lng: 127.0276 },
    jongno: { name: '종로구', lat: 37.5729, lng: 126.9793 },
    //나머지 서울 구단위로 추가하기
}

declare global {
    interface Window {
        kakao: any
    } //후에 따로 빼주기
}

export default function PromotionPlace() {
    const [showMap, setShowMap] = useState(false) //지도버튼
    const [selectedArea, setSelectedArea] = useState('seoul') //지역기본설정
    const mapRef = useRef<any>(null)

    const handleMapButtonClick = () => {
        setShowMap(!showMap)
    }

    const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedArea(e.target.value)
    }

    useEffect(() => {
        if (showMap) {
            if (!mapRef.current) {
                const script = document.createElement('script')
                script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`
                script.async = true
                document.head.appendChild(script)

                script.onload = () => {
                    window.kakao.maps.load(() => {
                        const container = document.getElementById('map')
                        const options = {
                            center: new window.kakao.maps.LatLng(areas[selectedArea].lat, areas[selectedArea].lng),
                            level: 7,
                        }
                        const kakaoMap = new window.kakao.maps.Map(container, options)
                        mapRef.current = kakaoMap
                    })
                }

                return () => {
                    document.head.removeChild(script)
                }
            } else {
                const moveLatLon = new window.kakao.maps.LatLng(areas[selectedArea].lat, areas[selectedArea].lng)
                mapRef.current.setCenter(moveLatLon)
            }
        }
    }, [showMap, selectedArea])

    useEffect(() => {
        if (mapRef.current && !showMap) {
            mapRef.current = null
        }
    }, [showMap])

    return (
        <main className="flex min-h-screen flex-col items-center p-6">
            <div className="flex-1 w-full max-w-4xl">
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
                {/* 메뉴이름 */}
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-purple-700">홍보게시판</h1>
                </header>
                {/* 게시판 필터링부분 */}
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
                                <select className="border-none p-2 bg-white">
                                    <option value="all">전체</option>
                                    <option value="band">밴드</option>
                                    <option value="music">음악</option>
                                    <option value="dance">춤</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {/* 지도 버튼 */}
                            <button className="bg-purple-700 text-white py-2 px-4" onClick={handleMapButtonClick}>
                                <FaMapLocationDot />
                            </button>
                            {/* 게시글 작성 버튼 */}
                            <button className="bg-purple-700 text-white py-2 px-4">
                                <FaRegEdit />
                            </button>
                        </div>
                    </div>
                    {/* 지도 표시 부분 */}
                    {showMap && <div className="w-full h-96 border" id="map"></div>}
                    {/* 게시판 내용 */}
                    <div className="border p-4 mb-6">
                        <p>게시판 내용</p>
                    </div>
                </section>
            </div>
        </main>
    )
}
