import type { PaginationQuery, ReturnWithErrPromise } from '~type/common.type';
import type { Pet, PetWithUser, PetType, Breed, PetDto, PetQuery } from '~type/pet.type';

import dayjs from 'dayjs';
import { join } from '~helper/path.helper';
import { apiClient, apiClientAuth } from '~api/api-client';
import { errorHandler, HttpException, isHttpException } from '~helper/error-handler';
import { serverUrl } from '~constant/common';

type PetResponse = Omit<Pet, 'birthday'> & { birthday: string | null };
type PetResponseWithUser = PetResponse & { user: PetWithUser['user'] };

class PetService {
    private readonly petEndpoint = 'pet';
    private readonly petTypeEndpoint = 'pet-type';
    private readonly petBreedEndpoint = 'pet-breed';

    async count(queryParams?: PetQuery): ReturnWithErrPromise<{ total: number }> {
        try {
            const count = await apiClient.get<{ total: number }>(join(this.petEndpoint, 'count'), {
                params: queryParams,
            });

            if (isHttpException(count.data)) throw new HttpException(count.data);
            return [count.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getMyOne(id: number): ReturnWithErrPromise<Pet> {
        try {
            const pet = await apiClientAuth.get<PetResponse>(join(this.petEndpoint, 'my', id));
            if (isHttpException(pet.data)) throw new HttpException(pet.data);
            return [this.convertData(pet.data), null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getMyMany(): ReturnWithErrPromise<Pet[]> {
        try {
            const pets = await apiClientAuth.get<PetResponse[]>(join(this.petEndpoint, 'my'));
            if (isHttpException(pets.data)) throw new HttpException(pets.data);
            const convertedPets = pets.data.map(pet => this.convertData(pet));
            return [convertedPets, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getOne(id: number): ReturnWithErrPromise<PetWithUser> {
        try {
            const pet = await apiClient.get<PetResponseWithUser>(join(this.petEndpoint, id));
            if (isHttpException(pet.data)) throw new HttpException(pet.data);
            return [this.convertData(pet.data), null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getAll(queryParams?: PetQuery & PaginationQuery): ReturnWithErrPromise<PetWithUser[]> {
        try {
            const pets = await apiClient.get<PetResponseWithUser[]>(this.petEndpoint, {
                params: queryParams,
            });
            if (isHttpException(pets.data)) throw new HttpException(pets.data);
            const convertedPets = pets.data.map(pet => this.convertData(pet));
            return [convertedPets, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getPetType(): ReturnWithErrPromise<PetType[]> {
        try {
            const petTypes = await apiClient.get<PetType[]>(this.petTypeEndpoint);
            if (isHttpException(petTypes.data)) throw new HttpException(petTypes.data);
            return [petTypes.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async getBreed({ petTypeId }: { petTypeId?: number } = {}): ReturnWithErrPromise<Breed[]> {
        try {
            const breeds = await apiClient.get<Breed[]>(this.petBreedEndpoint, {
                params: { petTypeId },
            });
            if (isHttpException(breeds.data)) throw new HttpException(breeds.data);
            return [breeds.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async create(data: PetDto): ReturnWithErrPromise<Pet> {
        const convertedData = this.prepareDataToPush(data);

        try {
            const pet = await apiClientAuth.post<PetResponse>(this.petEndpoint, convertedData);
            if (isHttpException(pet.data)) throw new HttpException(pet.data);
            return [this.convertData(pet.data), null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async update(id: number, data: PetDto): ReturnWithErrPromise<Pet> {
        const convertedData = this.prepareDataToPush(data);

        try {
            const pet = await apiClientAuth.patch<PetResponse>(
                join(this.petEndpoint, id),
                convertedData,
            );
            if (isHttpException(pet.data)) throw new HttpException(pet.data);
            return [this.convertData(pet.data), null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async delete(id: number): ReturnWithErrPromise<Pet> {
        try {
            const pet = await apiClientAuth.delete<PetResponse>(join(this.petEndpoint, id));
            if (isHttpException(pet.data)) throw new HttpException(pet.data);
            return [this.convertData(pet.data), null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async setImage(file: File, petId: number): ReturnWithErrPromise<{ image: string }> {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const pet = await apiClientAuth.post(this.petEndpoint + 'image/' + petId, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (isHttpException(pet.data)) throw new HttpException(pet.data);
            return [pet.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async deleteImage(petId: number): ReturnWithErrPromise {
        try {
            const pet = await apiClientAuth.delete(this.petEndpoint + 'image/' + petId);
            if (isHttpException(pet.data)) throw new HttpException(pet.data);
            return [pet.data, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    private convertData<T extends PetResponse | PetResponseWithUser>(pet: T) {
        const birthday = dayjs(pet.birthday).isValid() ? dayjs(pet.birthday) : null;
        const lostAt = dayjs(pet.lostInfo?.lostAt);
        const image = pet.image
            ? new URL(join(this.petEndpoint, 'image', pet.image), serverUrl).href
            : null;

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
