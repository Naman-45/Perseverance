import { selector } from 'recoil';
import { user } from '../atoms/user';

export const userLogin = selector({
    key: 'userLogin',
    get: ({ get }) => {
        const useratom = get(user);

        return useratom.userEmail;
    }
})