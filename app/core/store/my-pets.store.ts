import type { Pet } from '~type/pet.type';
import { create } from 'zustand';

type MyPetsState = { pets: Pet[] | null };

type MyPetsActions = {
    setPets: (pets: Pet[]) => void;
    clearMyPetsData: () => void;
};

const useMyPetsStore = create<MyPetsState & MyPetsActions>()(set => ({
    pets: null,
    setPets: pets => set({ pets }),
    clearMyPetsData: () => set({ pets: null }),
}));

export default useMyPetsStore;
