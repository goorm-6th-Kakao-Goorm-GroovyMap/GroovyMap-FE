import { atom } from 'recoil';
// import { recoilPersist } from 'recoil-persist';
// const { persistAtom } = recoilPersist();

export const initialUserState = {
    nickname: '',
    profileUrl: '',
}; //회원정보 받아오는 부분들 수정함

// 유저 정보 상태
export const userState = atom({
    key: 'userState',
    default: initialUserState,
    // effects_UNSTABLE: [persistAtom], // 새로고침해도 유지되도록
});

// 마이페이지에서 활성화된 창
export const activeTabState = atom({
    key: 'activeTabState',
    default: 'posts', // 기본값을 'posts'로 설정
    // effects_UNSTABLE: [persistAtom], // 새로고침해도 유지되도록
});
