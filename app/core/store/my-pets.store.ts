import type { Pet } from '~type/pet.type';
import { create } from 'zustand';

type MyPetsState = { pets: Pet[] };

type MyPetsActions = {
    setPets: (pets: Pet[]) => void;
    addPet: (pet: Pet) => void;
    updatePet: (pet: Pet) => void;
    clearMyPetsData: () => void;
};

const useMyPetsStore = create<MyPetsState & MyPetsActions>()(set => ({
    pets: [],
    setPets: pets => set({ pets }),
    addPet: pet => set(state => ({ pets: [...state.pets, pet] })),
    updatePet: pet =>
        set(state => ({
            pets: state.pets.map(statePet => (statePet.id === pet.id ? pet : statePet)),
        })),
    clearMyPetsData: () => set({ pets: [] }),
}));

export default useMyPetsStore;
