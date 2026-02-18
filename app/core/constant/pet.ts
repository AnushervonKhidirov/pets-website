import { Sex } from '~type/pet.type';

export const sex: Record<Sex, { en: string; ru: string }> = {
    Male: {
        en: 'Male',
        ru: 'Самец',
    },
    Female: {
        en: 'Female',
        ru: 'Самка',
    },
};
