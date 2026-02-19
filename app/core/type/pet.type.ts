import type { Dayjs } from 'dayjs';
import type { User } from './user.type';

export type Pet = {
    id: number;
    name: string;
    about: string | null;
    sex: Sex | null;
    birthday: Dayjs | null;
    microchipId: string | null;
    petTypeId: number;
    petType: PetType;
    breedId: number | null;
    breed: Omit<Breed, 'petType'> | null;
    image: string | null;
    lost: boolean;
    lostAt: Dayjs | null;
};

export type PetWithUser = Pet & { user: Omit<User, 'authType'> };

export type PetDto = Omit<Pet, 'id' | 'petType' | 'breed' | 'user' | 'image' | 'lost'>;

export type PetType = {
    id: number;
    en: string;
    ru: string;
};

export type Breed = {
    id: number;
    en: string;
    ru: string;
    petTypeId: number;
    petType: PetType;
};

export enum Sex {
    Male = 'Male',
    Female = 'Female',
}
