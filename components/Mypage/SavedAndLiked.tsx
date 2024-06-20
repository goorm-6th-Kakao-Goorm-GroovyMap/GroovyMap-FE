'use client';
// 좋아요 저장한 콘텐츠
import React from 'react';
import { User } from '@/types/types';

interface SavedAndLikedProps {
    user: User;
    isOwner: boolean;
}

const SavedAndLiked: React.FC<SavedAndLikedProps> = ({ user, isOwner }) => {
    return <div>저장/좋아요 한 글 콘텐츠</div>;
};

export default SavedAndLiked;
