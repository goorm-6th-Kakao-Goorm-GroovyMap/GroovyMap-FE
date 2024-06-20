'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import apiClient from '@/api/apiClient';
import { userState } from '@/recoil/state/userState';
import MyPage from '@/components/Mypage/Mypage';

const UserProfilePage = () => {
    const { id } = useParams(); // URL에서 사용자 ID를 추출
    const loggedInUser = useRecoilValue(userState); // 로그인한 사용자 정보 가져오기
    const [profileUser, setProfileUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!id) {
                    setProfileUser(loggedInUser);
                } else {
                    // 다른 사용자일 경우 유저 정보를 아이디로 받아옴
                    const response = await apiClient.get(`/mypage/${id}`);
                    setProfileUser(response.data);
                }
            } catch (error) {
                setError('Error fetching user data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [id, loggedInUser]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const user = profileUser || loggedInUser;
    const isOwner = !id || loggedInUser?.id === user?.id;

    return <MyPage user={user} isOwner={isOwner} />;
};

export default UserProfilePage;
