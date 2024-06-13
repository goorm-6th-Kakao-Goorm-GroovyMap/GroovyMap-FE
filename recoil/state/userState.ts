import { atom } from 'recoil';

export const userState = atom({
    key: 'userState',
    default: {
        email: '',
        nickname: '',
        region: '',
        part: '',
        subPart: '',
        profileImage: '',
        bio: '',
        followers: 0,
        following: 0,
    },
});

//마이페이지에서 활성화된 창
export const activeTabState = atom({
    key: 'activeTabState',
    default: 'posts', // 기본값을 'posts'로 설정
});
