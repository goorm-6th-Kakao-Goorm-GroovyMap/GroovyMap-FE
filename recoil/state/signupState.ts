import { atom } from 'recoil';

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    nickname: string;
    certificationCode: string;
    region: string;
    part: string;
    subPart: string;
}

export const signUpState = atom<FormData>({
    key: 'signUpState',
    default: {
        email: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        certificationCode: '',
        region: 'ALL',
        part: 'all',
        subPart: '',
    },
});

//마이페이지에서 활성화된 창
export const activeTabState = atom({
    key: 'activeTabState',
    default: 'posts', // 기본값을 'posts'로 설정
});
