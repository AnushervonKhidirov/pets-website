import type { User } from '~type/user.type';
import { create } from 'zustand';

type UserState = { user: User | null };

type UserActions = {
    setUser: (user: User) => void;
    clearUserData: () => void;
};

const useUserStore = create<UserState & UserActions>()(set => ({
    user: null,
    setUser: user => set({ user }),
    clearUserData: () => set({ user: null }),
}));

export default useUserStore;
