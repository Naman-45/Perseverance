import { user } from '../atoms/user';
import { selector } from 'recoil';

export const isUserLoading = selector({
    key: isUserLoading,
    get: ({ get }) => {
        const loading = get(userState);

        return loading.isLoading;
    }
})