'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import { IoMdSearch } from 'react-icons/io'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import apiClient from '@/api/apiClient'
import axios from 'axios'

interface Coordinates {
    latitude: number | null
    longitude: number | null
}

// 백엔드 api post요청 보내기 (글쓰기작성폼데이터)
const postFormData = async (formData: FormData): Promise<any> => {
    try {
        const response = await apiClient.post('/promotionboard/write', formData, {
            withCredentials: true,
        })
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorText = error.response?.data || 'Unknown error'
            throw new Error(`Form submission failed: ${errorText}`)
        } else {
            throw new Error(`Form submission failed: ${error}`)
        }
    }
}

export default function Write() {
    const router = useRouter()
    const [selectedType, setSelectedType] = useState<string>('ALL')
    const [address, setAddress] = useState<string>('')
    const [fileNames, setFileNames] = useState<File[]>([])
    const [coordinates, setCoordinates] = useState<Coordinates>({ latitude: null, longitude: null })

    const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedType(e.target.value)
    }

    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value)
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFileNames(Array.from(e.target.files))
        }
    }

    // 다음 우편 서비스 이용
    const loadDaumPostcode = () => {
        return new Promise<void>((resolve) => {
            const script = document.createElement('script')
            script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
            script.onload = () => {
                resolve()
            }
            document.head.appendChild(script)
        })
    }

    // 주소를 가져와서 위도 경도로 변환
    const convertAddressToCoordinates = async (address: string) => {
        try {
            const response = await fetch(
                `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
                {
                    headers: {
                        Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
                    },
                },
            )

            const data = await response.json()

            if (data.documents && data.documents.length > 0) {
                const { y, x } = data.documents[0]
                setCoordinates({ latitude: parseFloat(y), longitude: parseFloat(x) })
            } else {
                console.warn('주소를 찾을 수 없습니다.')
            }
        } catch (error) {
            console.error('주소 변환 중 오류 발생:', error)
        }
    }

    const handleAddressSearch = async () => {
        await loadDaumPostcode()
        new (window as any).daum.Postcode({
            oncomplete: async function (data: any) {
                const addr = data.address
                setAddress(addr)
                await convertAddressToCoordinates(addr)
            },
        }).open()
    }

    const mutation = useMutation({
        mutationFn: (formData: FormData) => postFormData(formData),
    })

    // 폼 제출 핸들러
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!coordinates.latitude || !coordinates.longitude) {
            alert('주소를 입력하고 검색하세요.')
            return
        }

        const formData = new FormData()
        formData.append('title', (e.target as any).title.value)
        if (fileNames.length > 0) {
            fileNames.forEach((file) => formData.append('fileNames', file))
        }
        formData.append('region', (e.target as any).region.value)
        formData.append('part', selectedType)
        formData.append('coordinates', JSON.stringify(coordinates))
        formData.append('content', (e.target as any).content.value.replace(/\n/g, '<br>'))

        try {
            await mutation.mutateAsync(formData)
            alert('Form submitted successfully!')
            router.push('/promotion-place')
        } catch (error: any) {
            alert(`Form submission failed: ${error.message}`)
        }
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
                <form className="p-6 rounded border border-gray-300" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="font-bold mb-2" htmlFor="title">
                            제목
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="w-full border rounded p-2"
                            placeholder="제목을 입력하세요..."
                        />
                    </div>
                    <div className="flex items-center rounded-lg mb-4">
                        <label className="font-bold mr-2">지역</label>
                        <select name="region" className="border-none rounded p-2 bg-white">
                            <option value="ALL">전체</option>
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
                            <option value="SONGPAGU">송파구</option>
                            <option value="YANGCHEONGU">양천구</option>
                            <option value="YEONGDEUNGPOGU">영등포구</option>
                            <option value="YONGSANGU">용산구</option>
                            <option value="EUNPYEONGGU">은평구</option>
                            <option value="JONGNOGU">종로구</option>
                            <option value="JUNGGU">중구</option>
                            <option value="JUNGNANGGU">중랑구</option>
                        </select>
                    </div>
                    <div className="flex items-center rounded-lg mb-4">
                        <label className="font-bold mr-2">유형</label>
                        <select name="part" className="border-none rounded p-2 bg-white" onChange={handleTypeChange}>
                            <option value="ALL">전체</option>
                            <option value="BAND">밴드</option>
                            <option value="VOCAL">음악</option>
                            <option value="DANCE">춤</option>
                        </select>
                    </div>
                    <div className="mb-4 flex items-center">
                        <label className="font-bold mb-2 mr-2" htmlFor="address">
                            주소
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            className="flex-grow border rounded p-2"
                            placeholder="주소를 입력하세요..."
                            value={address}
                            onChange={handleAddressChange}
                        />
                        <button
                            type="button"
                            onClick={handleAddressSearch}
                            className="ml-2 bg-purple-700 text-white font-bold py-2 px-4 rounded"
                        >
                            주소 검색
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="font-bold mb-2" htmlFor="fileNames">
                            미디어 업로드
                        </label>
                        <p className="text-red-400">사진 또는 동영상 하나만 업로드 가능합니다. (제한10MB)</p>
                        <input
                            type="file"
                            id="fileNames"
                            name="fileNames"
                            className="w-full bg-white p-2"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="font-bold mb-2" htmlFor="content">
                            내용
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            className="w-full border rounded p-2"
                            placeholder="내용을 입력하세요..."
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-purple-700 text-white font-bold py-2 px-4 rounded">
                            업로드
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
