'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from 'react-icons/fa'
import { VscFileMedia } from 'react-icons/vsc'

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

    if (!show || !post) {
        return null
    }

    const handleLikeClick = () => {
        setLiked(!liked)
        setLikesCount(liked ? likesCount - 1 : likesCount + 1)
    }

    const handleSaveClick = () => {
        setSaved(!saved)
        setSavesCount(saved ? savesCount - 1 : savesCount + 1)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">{post.title}</h2>
                <p className="mb-4">{post.author}</p>
                <p className="mb-4">{post.content}</p>
                {post.fileNames ? (
                    post.fileNames.endsWith('.mp4') ? (
                        <video src={post.fileNames} controls className="w-full h-full object-cover rounded-lg mb-4" />
                    ) : (
                        <div className="mb-4">
                            <Image
                                src={post.fileNames}
                                alt="media"
                                layout="responsive"
                                width={500}
                                height={300}
                                className="rounded-lg"
                            />
                        </div>
                    )
                ) : (
                    <VscFileMedia size={48} className="text-gray-500 mb-4" />
                )}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <button onClick={handleLikeClick}>
                            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-500" />}
                            <span>{likesCount}</span>
                        </button>
                        <button onClick={handleSaveClick}>
                            {saved ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-gray-500" />}
                            <span>{savesCount}</span>
                        </button>
                    </div>
                    <div>
                        <span className="text-gray-500">조회수: {post.viewCount}</span>
                    </div>
                </div>
                <button className="bg-purple-700 text-white py-2 px-4 rounded" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    )
}

export default Modal
