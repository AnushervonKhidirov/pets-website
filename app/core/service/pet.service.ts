import type { ReturnWithErrPromise } from '~type/common.type';
import type { Pet, PetWithUser, PetType, Breed, PetDto } from '~type/pet.type';

import dayjs from 'dayjs';
import { apiClient, apiClientAuth } from '~api/api-client';
import { errorHandler, isHttpException } from '~helper/error-handler';
import { serverUrl } from '~constant/common';

type PetResponse = Omit<Pet, 'birthday'> & { birthday: string | null };
type PetResponseWithUser = PetResponse & { user: PetWithUser['user'] };

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

    async getOne(id: number): ReturnWithErrPromise<PetWithUser> {
        try {
            const pet = await apiClient.get<PetResponseWithUser>(`/pet/${id}`);
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

    async getPetType(): ReturnWithErrPromise<PetType[]> {
        try {
            const petTypes = await apiClient.get<PetType[]>('/pet-type');
            if (isHttpException(petTypes.data)) throw petTypes.data;
            return [petTypes.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getBreed({ petTypeId }: { petTypeId?: number } = {}): ReturnWithErrPromise<Breed[]> {
        try {
            const breeds = await apiClient.get<Breed[]>('/pet-breed', { params: { petTypeId } });
            if (isHttpException(breeds.data)) throw breeds.data;
            return [breeds.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async create(data: PetDto): ReturnWithErrPromise<Pet> {
        const convertedData = this.prepareDataToPush(data);

        try {
            const pet = await apiClientAuth.post<PetResponse>('/pet', convertedData);
            if (isHttpException(pet.data)) throw pet.data;
            return [this.convertData(pet.data), null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async update(id: number, data: PetDto): ReturnWithErrPromise<Pet> {
        const convertedData = this.prepareDataToPush(data);

        try {
            const pet = await apiClientAuth.patch<PetResponse>(`/pet/${id}`, convertedData);
            if (isHttpException(pet.data)) throw pet.data;
            return [this.convertData(pet.data), null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async delete(id: number): ReturnWithErrPromise<Pet> {
        try {
            const pet = await apiClientAuth.delete<PetResponse>(`/pet/${id}`);
            if (isHttpException(pet.data)) throw pet.data;
            return [this.convertData(pet.data), null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async setImage(file: File, petId: number): ReturnWithErrPromise<{ image: string }> {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const pet = await apiClientAuth.post(`/pet/image/${petId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (isHttpException(pet.data)) throw pet.data;
            return [pet.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async deleteImage(petId: number): ReturnWithErrPromise {
        try {
            const pet = await apiClientAuth.delete(`/pet/image/${petId}`);
            if (isHttpException(pet.data)) throw pet.data;
            return [pet.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    private convertData<T extends PetResponse | PetResponseWithUser>(pet: T) {
        const birthday = dayjs(pet.birthday).isValid() ? dayjs(pet.birthday) : null;
        const lostAt = dayjs(pet.lostInfo?.lostAt);
        const image = pet.image ? `${serverUrl}/pet/image/${pet.image}` : null;

        const lostInfo: Pet['lostInfo'] = pet.lostInfo
            ? {
                  ...pet.lostInfo,
                  lostAt,
              }
            : null;

        return { ...pet, birthday, image, lostInfo };
    }

    private prepareDataToPush({ birthday, ...data }: PetDto) {
        const convertedData: Record<keyof PetDto, string | number | null> = {
            ...data,
            birthday: birthday?.startOf('date').toString() ?? null,
        };

        if ('image' in convertedData) delete convertedData.image;

        for (const key in convertedData) {
            const k = key as keyof typeof convertedData;
            if (!convertedData[k]) convertedData[k] = null;
        }

        return convertedData;
    }
}

export default new PetService();
