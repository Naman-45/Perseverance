import { atom } from 'recoil';

export const user = atom({
    key: 'userState',
    default: {
        isLoading: true,
        userEmail: null,
    },
})