//로그인한 사용자의 마이페이지
'use client';

import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/state/userState';
import MyPage from '@/components/Mypage/Mypage';

const MyPageIndex = () => {
    const loggedInUser = useRecoilValue(userState); // 로그인한 사용자 정보 가져오기

    if (!loggedInUser) {
        return <div>Loading...</div>;
    }

    return <MyPage user={loggedInUser} isOwner={true} />;
};

export default MyPageIndex;
