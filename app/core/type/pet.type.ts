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
    user: Omit<User, 'authType'>;
    image: string | null;
    lost: boolean;
};

export type CratePetDto = Pick<
    Pet,
    'name' | 'sex' | 'birthday' | 'microchipId' | 'petTypeId' | 'breedId'
>;

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
