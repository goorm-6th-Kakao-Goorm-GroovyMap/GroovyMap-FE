import React, { useState } from 'react'
import Image from 'next/image'
import { VscFileMedia } from 'react-icons/vsc'
import { useRecoilValue } from 'recoil'
import { userState } from '@/recoil/state/userState'
import apiClient from '@/api/apiClient'
import { FaTrash } from 'react-icons/fa'

interface UserProfileProps {
    memberId: number
    profileImage: string
    nickname: string
    introduction: string
    part: string
    region: string
}

// UserProfile 컴포넌트 정의
const UserProfile: React.FC<UserProfileProps> = ({ profileImage, nickname, introduction, part, region }) => {
    const [isFlipped, setIsFlipped] = useState(false)
    const currentUser = useRecoilValue(userState)

    // 카드 클릭 핸들러
    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsFlipped(!isFlipped)
    }

    // 버튼 클릭 핸들러, 멤버 아이디로 리다이렉트
    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        window.location.href = `/mypage/${nickname}`
    }

    // 삭제 버튼 클릭 핸들러
    const handleDeleteClick = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm('Are you sure you want to delete this profile?')) {
            try {
                await apiClient.delete('/profile/delete')
                alert('게시물이 삭제되었습니다.')
            } catch (error) {
                alert('Failed to delete profile')
            }
        }
    }

    return (
        <div className="w-full p-4">
            <div
                className={`relative w-full h-64 bg-white rounded-lg shadow-lg transform-style-3d transition-transform duration-500 ${
                    isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={handleCardClick}
            >
                {/* 카드 앞면 */}
                <div className="absolute w-full h-full backface-hidden">
                    {profileImage && profileImage.length > 0 ? (
                        <div className="relative w-full h-2/3 rounded-t-lg overflow-hidden">
                            <Image
                                src={profileImage}
                                alt={nickname}
                                fill
                                sizes="(max-width: 768px) 100vw, 700px"
                                style={{ objectFit: 'cover' }}
                                className="w-full h-full object-cover rounded-t-lg"
                                unoptimized={true}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-2/3 flex items-center justify-center bg-gray-200 rounded-t-lg">
                            <VscFileMedia size={64} className="text-gray-500" />
                        </div>
                    )}
                    <div className="p-4 bg-white rounded-b-lg">
                        <h2 className="text-lg font-bold">{nickname}</h2>
                        <p className="text-sm text-gray-600">
                            {part}, {region}
                        </p>
                    </div>
                </div>
                {/* 카드 뒷면 */}
                <div className="absolute w-full h-full bg-purple-700 rounded-lg text-white flex flex-col items-center justify-center backface-hidden transform rotate-y-180">
                    <div className="p-4">
                        <p className="text-sm mb-4">{introduction}</p>
                        <button
                            onClick={handleButtonClick}
                            className="px-4 py-2 bg-white text-purple-700 font-bold rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
                        >
                            View Profile
                        </button>
                        {currentUser && currentUser.nickname === nickname && (
                            <button
                                onClick={handleDeleteClick}
                                className="m-4 px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                            >
                                <FaTrash className="text-white-500" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile
