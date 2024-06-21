import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

// 세션 스토리지 사용해서 로그인 상태 저장
const { persistAtom } = recoilPersist({
    key: 'recoil-persist', // 저장될 키 이름
    storage: typeof window === 'undefined' ? undefined : window.sessionStorage,
});

export const initialUserState = {
    nickname: '',
    profileUrl: '',
}; // 회원정보 받아오는 부분들 수정

// 유저 정보 상태
export const userState = atom({
    key: 'userState',
    default: initialUserState,
    effects_UNSTABLE: [persistAtom], // 새로고침해도 유지되도록
});

// 마이페이지에서 활성화된 창
export const activeTabState = atom({
    key: 'activeTabState',
    default: 'posts', // 기본값을 'posts'로 설정
    effects_UNSTABLE: [persistAtom], // 새로고침해도 유지되도록
});
