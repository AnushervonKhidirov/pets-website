import type { User } from '~type/user.type';
import { create } from 'zustand';

type UserState = { user: User | null };

type UserActions = {
    setUser: (user: User | null) => void;
};

const useUserStore = create<UserState & UserActions>()(set => ({
    user: null,
    setUser: user => set({ user }),
}));

export default useUserStore;
