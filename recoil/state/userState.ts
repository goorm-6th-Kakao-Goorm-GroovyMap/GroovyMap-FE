import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist'; //새로 고침해도 유지되게 설치 npm install recoil-persist

const { persistAtom } = recoilPersist();

//유저 정보 상태
export const userState = atom({
    key: 'userState',
    default: {
        email: '',
        nickname: '',
        region: '',
        part: '',
        type: '',
        profileImage: '',
        bio: '',
        followers: 0,
        following: 0,
    },
    effects_UNSTABLE: [persistAtom], //새로고침해도 유지되도록
});

//마이페이지에서 활성화된 창
export const activeTabState = atom({
    key: 'activeTabState',
    default: 'posts', // 기본값을 'posts'로 설정
    effects_UNSTABLE: [persistAtom], //새로고침해도 유지되도록
});
