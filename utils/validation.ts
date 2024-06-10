// utils/validation.ts

export const validateNickname = (nickname: string): boolean => {
    const re = /^[a-zA-Z0-9]{2,13}$/;
    return re.test(nickname);
};

export const validatePassword = (password: string): boolean => {
    const re = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*\W).{8,16}$/;
    return re.test(password);
};

export const validateEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};
