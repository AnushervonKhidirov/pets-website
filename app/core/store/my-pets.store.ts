import type { Pet } from '~type/pet.type';
import { create } from 'zustand';

type MyPetsState = { pets: Pet[] };

type MyPetsActions = {
    setPets: (pets: Pet[]) => void;
    addPet: (pet: Pet) => void;
    clearMyPetsData: () => void;
};

const useMyPetsStore = create<MyPetsState & MyPetsActions>()(set => ({
    pets: [],
    setPets: pets => set({ pets }),
    addPet: pet => set(state => ({ pets: [...state.pets, pet] })),
    clearMyPetsData: () => set({ pets: [] }),
}));

export default useMyPetsStore;
