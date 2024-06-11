'use client'

import React, { useState } from 'react'
import { IoMdSearch } from 'react-icons/io'

interface ImageObject {
    id: string
    image: string
    seed: number
    nsfw_content_detected: any
    nsfw_score: any
}

interface ApiResponse {
    id: string
    model_version: string
    images: ImageObject[]
}

const AiLogoGeneration: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('')
    const [negativePrompt, setNegativePrompt] = useState<string>('')
    const [images, setImages] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrompt(e.target.value)
    }

    const handleNegativePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNegativePrompt(e.target.value)
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('https://api.kakaobrain.com/v2/inference/karlo/t2i', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
                },
                body: JSON.stringify({
                    version: 'v2.1',
                    prompt: prompt,
                    negative_prompt: negativePrompt,
                    width: 256,
                    height: 256,
                    upscale: true,
                    image_format: 'png',
                    samples: 3,
                }),
            })

            if (!response.ok) {
                console.error('Failed to generate logo')
                setIsLoading(false)
                return
            }

            const result: ApiResponse = await response.json()
            console.log('API response:', result)
            const imageUrls = result.images.map((image) => image.image) // Extract URLs from image objects
            setImages(imageUrls)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
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
                    <h1 className="text-2xl font-bold text-purple-700">AI 로고 생성</h1>
                </header>
                <div className="p-6 rounded border border-gray-300 bg-white">
                    <div className="mb-4 p-2">
                        <h2 className="mb-4 font-bold">Prompt</h2>
                        <input
                            type="text"
                            id="prompt"
                            className="w-full border-none rounded p-2 bg-purple-200"
                            placeholder="예시)단순하고 강력한 인상을 주는 팀 로고를 생성해 주세요. 팀 이름은 'Eagle Eyes'입니다"
                            value={prompt}
                            onChange={handlePromptChange}
                        />
                    </div>
                    <div className="mb-4 p-2">
                        <h2 className="mb-4 font-bold">Negative_prompt</h2>
                        <input
                            type="text"
                            id="negative_prompt"
                            className="w-full border-none rounded p-2 bg-purple-200"
                            placeholder="예시)빨간 불꽃은 싫습니다."
                            value={negativePrompt}
                            onChange={handleNegativePromptChange}
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="bg-purple-700 rounded-lg text-white p-2 hover:bg-white hover:text-purple-700 hover:border hover:border-purple-700"
                            onClick={handleSubmit}
                        >
                            로고 만들기
                        </button>
                    </div>
                </div>
                {isLoading && (
                    <div className="mt-6 p-6 rounded border border-gray-300 bg-white text-center">
                        <h2 className="font-bold text-purple-700">이미지를 생성하는 중입니다...</h2>
                    </div>
                )}
                {!isLoading && images.length > 0 && (
                    <div className="mt-6 p-6 rounded border border-gray-300 bg-white">
                        <h2 className="mb-4 font-bold">생성된 이미지</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {images.map((image, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <img
                                        src={image}
                                        alt={`Generated logo ${index + 1}`}
                                        className="w-64 h-64 object-contain mb-2"
                                    />
                                    <a
                                        href={image}
                                        download={`logo_${index + 1}.png`}
                                        className="bg-purple-700 rounded-lg text-white p-2 hover:bg-white hover:text-purple-700 hover:border hover:border-purple-700"
                                    >
                                        다운로드
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AiLogoGeneration
