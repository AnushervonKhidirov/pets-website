import type { User } from '~type/user.type';
import { create } from 'zustand';

type UserState = { user: User | null };

type UserActions = {
    update: (user: User) => void;
    clear: () => void;
};

const useUserStore = create<UserState & UserActions>()(set => ({
    user: null,
    update: user => set({ user }),
    clear: () => set({ user: null }),
}));

export default useUserStore;
