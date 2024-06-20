'use client';
//글 기록
import React from 'react';
import { User } from '@/types/types';

interface PostRecordProps {
    user: User;
    isOwner: boolean;
}

const PostRecord: React.FC<PostRecordProps> = ({ user, isOwner }) => {
    return <div>글 기록 콘텐츠</div>;
};

export default PostRecord;
