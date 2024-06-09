'use client'

import { useState } from 'react'
import { FaUserCircle, FaHeart, FaRegHeart, FaStar, FaRegStar } from 'react-icons/fa'
import { VscFileMedia } from 'react-icons/vsc'
import Image from 'next/image'

interface PostItemProps {
    userImage: string
    userName: string
    title: string
    fileNames: string
    initialLikesCount: number
    initialSavesCount: number
}

const PostItem: React.FC<PostItemProps> = ({
    userImage,
    userName,
    title,
    fileNames,
    initialLikesCount,
    initialSavesCount,
}) => {
    const [likesCount, setLikesCount] = useState(initialLikesCount)
    const [savesCount, setSavesCount] = useState(initialSavesCount)
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleLikeClick = () => {
        setLiked(!liked)
        setLikesCount(liked ? likesCount - 1 : likesCount + 1)
    }

    const handleSaveClick = () => {
        setSaved(!saved)
        setSavesCount(saved ? savesCount - 1 : savesCount + 1)
    }

    return (
        <div className="border p-2 rounded-lg bg-white">
            <div className="mb-2 h-64 flex items-center justify-center bg-gray-200 rounded-lg">
                {fileNames ? (
                    fileNames.endsWith('.mp4') ? (
                        <video src={fileNames} controls className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <Image src={fileNames} alt={title} layout="fill" objectFit="cover" className="rounded-lg" />
                    )
                ) : (
                    <VscFileMedia size={48} className="text-gray-500" />
                )}
            </div>
            <div className="flex items-center">
                {userImage ? (
                    <Image src={userImage} alt={userName} width={32} height={32} className="rounded-full mr-2" />
                ) : (
                    <FaUserCircle size={32} className="text-gray-500 mr-2" />
                )}
                <div className="flex-1">
                    <p className="font-bold text-sm">{title}</p>
                    <p className="text-gray-600 text-xs">{userName}</p>
                </div>
                <div className="ml-auto flex space-x-1">
                    <button onClick={handleLikeClick}>
                        {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-500" />}
                        <span>{likesCount}</span>
                    </button>
                    <button onClick={handleSaveClick}>
                        {saved ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-gray-500" />}
                        <span>{savesCount}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PostItem
