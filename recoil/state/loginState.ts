import { atom } from 'recoil';

interface User {
    email: string;
    profileImage?: string;
    // 필요할 경우, 다른 필드 더 추가해야 함
}

export const userState = atom<User | null>({
    key: 'userState',
    default: null,
});
