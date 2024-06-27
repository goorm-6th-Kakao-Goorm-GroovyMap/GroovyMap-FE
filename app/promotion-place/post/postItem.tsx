import React, { useState } from 'react'
import Image from 'next/image'
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaUserCircle, FaTrash } from 'react-icons/fa'
import { VscFileMedia } from 'react-icons/vsc'
import { useRecoilValue } from 'recoil'
import { userState } from '@/recoil/state/userState'

interface PostItemProps {
    postId: number
    profileImage: string
    userName: string
    title: string
    fileNames: string
    initialLikesCount: number
    initialSavesCount: number
    liked: boolean // 상위 컴포넌트로부터 전달받는 좋아요 상태
    saved: boolean // 상위 컴포넌트로부터 전달받는 저장 상태
}

const PostItem: React.FC<PostItemProps> = ({
    postId,
    profileImage,
    userName,
    title,
    fileNames,
    initialLikesCount,
    initialSavesCount,
    liked, // 상위 컴포넌트로부터 전달받는 좋아요 상태
    saved, // 상위 컴포넌트로부터 전달받는 저장 상태
}) => {
    const currentUser = useRecoilValue(userState)
    const [likesCount, setLikesCount] = useState(initialLikesCount) // 좋아요수
    const [savesCount, setSavesCount] = useState(initialSavesCount) // 저장하기수

    const truncatedTitle = title.length > 11 ? `${title.slice(0, 11)}...` : title

    return (
        <div className="border p-2 rounded-lg bg-white">
            <div className="mb-2 h-64 flex items-center justify-center bg-gray-200 rounded-lg relative">
                {fileNames ? (
                    fileNames.endsWith('.mp4') ? (
                        <video src={fileNames} controls className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <Image
                            src={fileNames}
                            alt={`${fileNames}`}
                            layout="fill"
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg"
                            unoptimized
                            priority
                            loading="eager"
                        />
                    )
                ) : (
                    <VscFileMedia size={48} className="text-gray-500" />
                )}
            </div>
            <div className="flex items-center">
                {profileImage ? (
                    <Image
                        src={profileImage}
                        alt={userName}
                        width={32}
                        height={32}
                        className="rounded-full mr-2"
                        unoptimized
                        priority
                    />
                ) : (
                    <FaUserCircle size={32} className="text-gray-500 mr-2" />
                )}
                <div className="flex-1">
                    <p className="font-bold text-sm">{truncatedTitle}</p>
                    <p className="text-gray-600 text-xs">{userName}</p>
                </div>
                <div className="ml-auto flex space-x-1">
                    <button className="flex items-center">
                        {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-500" />}
                        <span className="ml-1">{likesCount}</span>
                    </button>
                    <button className="flex items-center">
                        {saved ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-gray-500" />}
                        <span className="ml-1">{savesCount}</span>
                    </button>
                    {currentUser.nickname === userName && (
                        <button className="flex items-center">
                            <FaTrash className="text-red-500" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PostItem
