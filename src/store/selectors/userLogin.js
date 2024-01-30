import { selector } from 'recoil';
import { user } from '../atoms/user';

export const userLogin = selector({
    key: userLogin,
    get: ({ get }) => {
        const user = get(userState);

        return user.userEmail;
    }
})