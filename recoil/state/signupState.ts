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
