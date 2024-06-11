import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaUserCircle } from 'react-icons/fa'
import { VscFileMedia } from 'react-icons/vsc'

interface Post {
    id: number
    userImage: string
    author: string
    title: string
    content: string
    fileNames: string[]
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

interface ModalProps {
    show: boolean
    onClose: () => void
    post: Post | null
}

const Modal: React.FC<ModalProps> = ({ show, onClose, post }) => {
    const [likesCount, setLikesCount] = useState(post ? post.likesCount : 0)
    const [savesCount, setSavesCount] = useState(post ? post.savesCount : 0)
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        if (post) {
            setLikesCount(post.likesCount)
            setSavesCount(post.savesCount)
        }
    }, [post])

    if (!show || !post) {
        return null
    }

    const handleLikeClick = async () => {
        setLiked(!liked)
        setLikesCount(liked ? likesCount - 1 : likesCount + 1)
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/promotionboard/${post.id}/like`, {
                method: 'POST',
            })
        } catch (error) {
            console.error('Error liking post:', error)
        }
    }

    const handleSaveClick = async () => {
        setSaved(!saved)
        setSavesCount(saved ? savesCount - 1 : savesCount + 1)
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/promotionboard/${post.id}/save`, {
                method: 'POST',
            })
        } catch (error) {
            console.error('Error saving post:', error)
        }
    }

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={handleOutsideClick}
        >
            <div className="bg-white p-6 rounded shadow-lg max-w-4xl w-full flex items-start">
                <div className="w-1/2 pr-4">
                    {post.fileNames.length > 0 ? (
                        post.fileNames.map((fileName, index) =>
                            fileName.endsWith('.mp4') ? (
                                <video key={index} src={fileName} controls className="w-full h-full object-cover" />
                            ) : (
                                <div key={index} className="relative w-full h-[80vh]">
                                    <Image
                                        src={fileName}
                                        alt={`media-${index}`}
                                        layout="fill"
                                        objectFit="cover"
                                        unoptimized
                                        priority
                                        loading="eager"
                                    />
                                </div>
                            ),
                        )
                    ) : (
                        <VscFileMedia size={48} className="text-gray-500 mb-4" />
                    )}
                </div>

                <div className="w-1/2 flex flex-col items-start h-full">
                    {/* 상단부 (header) */}
                    <div className="flex-grow-0 flex-shrink-0 mb-4">
                        <h2 className="text-xl font-bold mt-2">{post.title}</h2>
                        <div className="flex space-x-4">
                            <p>
                                <strong>지역:</strong> {post.region}
                            </p>
                            <p>
                                <strong>파트:</strong> {post.part}
                            </p>
                        </div>
                    </div>

                    {/* 중간부 (main) */}
                    <div
                        className="flex-grow-0 flex-shrink-0 mb-4 overflow-y-auto"
                        style={{ maxHeight: '300px' }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    ></div>

                    {/* 하단부 (footer) */}
                    <div className="flex-grow-0 flex-shrink-0 flex items-center justify-between w-full mb-4 border-t border-gray-300">
                        <div className="flex items-center space-x-2 m-2">
                            {post.userImage ? (
                                <Image
                                    src={post.userImage}
                                    alt={post.author}
                                    width={32}
                                    height={32}
                                    className="rounded-full mr-2"
                                    unoptimized
                                    priority
                                />
                            ) : (
                                <FaUserCircle size={32} className="text-gray-500 mr-2" />
                            )}
                            <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={handleLikeClick} className="flex items-center">
                                {liked ? (
                                    <FaHeart className="text-red-500" />
                                ) : (
                                    <FaRegHeart className="text-gray-500" />
                                )}
                                <span className="ml-1">{likesCount}</span>
                            </button>
                            <button onClick={handleSaveClick} className="flex items-center">
                                {saved ? (
                                    <FaStar className="text-yellow-500" />
                                ) : (
                                    <FaRegStar className="text-gray-500" />
                                )}
                                <span className="ml-1">{savesCount}</span>
                            </button>
                            <span className="text-gray-500">조회수 {post.viewCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Modal
