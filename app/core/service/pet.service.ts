import type { ReturnWithErrPromise } from '~type/common.type';
import type { Pet } from '~type/pet.type';

import dayjs from 'dayjs';
import { apiClient, apiClientAuth } from '~api/api-client';
import { errorHandler, isHttpException } from '~helper/error-handler';

type PetResponse = Omit<Pet, 'birthday'> & { birthday: string | null };

class PetService {
    async getMy(): ReturnWithErrPromise<Pet[]> {
        try {
            const pets = await apiClientAuth.get<PetResponse[]>('/pet/my');
            if (isHttpException(pets.data)) throw pets.data;
            const convertedPets = pets.data.map(pet => this.convertData(pet));
            return [convertedPets, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getOne(id: number): ReturnWithErrPromise<Pet> {
        try {
            const pet = await apiClient.get<PetResponse>(`/pet${id}`);
            if (isHttpException(pet.data)) throw pet.data;
            return [this.convertData(pet.data), null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getAll(): ReturnWithErrPromise<Pet[]> {
        try {
            const pets = await apiClient.get<PetResponse[]>('/pet');
            if (isHttpException(pets.data)) throw pets.data;
            const convertedPets = pets.data.map(pet => this.convertData(pet));
            return [convertedPets, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    private convertData(pet: PetResponse): Pet {
        const birthday = dayjs(pet.birthday).isValid() ? dayjs(pet.birthday) : null;
        return { ...pet, birthday };
    }
}

export default new PetService();
