import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { User } from '@/types/types'; // User 타입 임포트
const { persistAtom } = recoilPersist();

//로그인했을때 받아오는 상태
export const initialUserState: LoginUser = {
    nickname: '',
    profileUrl: '',
};

export interface LoginUser {
    nickname: string; //
    profileUrl: string;
    token?: string; // token 속성 추가
}

// 유저 정보 상태
export const userState = atom({
    key: 'userState',
    default: initialUserState,
    // effects_UNSTABLE: [persistAtom], // 새로고침해도 유지되도록
});

// 마이페이지에서 관리하는 유저 상태
export const initialMyPageUserState: Partial<User> = {
    email: '',
    nickname: '',
    region: '',
    part: '',
    type: '',
    profileUrl: '',
    profileImage: '',
    introduction: '',
    followers: 0,
    following: 0,
};

//마이페이지 유저
export const myPageUserState = atom({
    key: 'myPageUserState',
    default: initialMyPageUserState,
});

// 마이페이지에서 활성화된 창
export const activeTabState = atom({
    key: 'activeTabState',
    default: 'posts', // 기본값을 'posts'로 설정
    effects_UNSTABLE: [persistAtom], // 새로고침해도 유지되도록
});
