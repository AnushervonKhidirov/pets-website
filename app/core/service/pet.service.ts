import type { PaginationQuery } from '~type/common.type';
import type { Pet, PetWithUser, PetType, Breed, PetDto, PetQuery } from '~type/pet.type';

import dayjs from 'dayjs';
import { join } from '~helper/path.helper';
import { apiClient, apiClientAuth } from '~api/api-client';
import { HttpException, isHttpException } from '~helper/error-handler';
import { serverUrl } from '~constant/common';

type PetResponse = Omit<Pet, 'birthday'> & { birthday: string | null };
type PetResponseWithUser = PetResponse & { user: PetWithUser['user'] };

class PetService {
    private readonly petEndpoint = 'pet';
    private readonly petTypeEndpoint = 'pet-type';
    private readonly petBreedEndpoint = 'pet-breed';

    async count(queryParams?: PetQuery): Promise<{ total: number }> {
        const count = await apiClient.get<{ total: number }>(join(this.petEndpoint, 'count'), {
            params: queryParams,
        });

        if (isHttpException(count.data)) throw new HttpException(count.data);
        return count.data;
    }

    async getMyOne(id: number): Promise<Pet> {
        const pet = await apiClientAuth.get<PetResponse>(join(this.petEndpoint, 'my', id));
        if (isHttpException(pet.data)) throw new HttpException(pet.data);
        return this.convertData(pet.data);
    }

    async getMyMany(): Promise<Pet[]> {
        const pets = await apiClientAuth.get<PetResponse[]>(join(this.petEndpoint, 'my'));
        if (isHttpException(pets.data)) throw new HttpException(pets.data);
        const convertedPets = pets.data.map(pet => this.convertData(pet));
        return convertedPets;
    }

    async getOne(id: number): Promise<PetWithUser> {
        const pet = await apiClient.get<PetResponseWithUser>(join(this.petEndpoint, id));
        if (isHttpException(pet.data)) throw new HttpException(pet.data);
        return this.convertData(pet.data);
    }

    async getAll(queryParams?: PetQuery & PaginationQuery): Promise<PetWithUser[]> {
        const pets = await apiClient.get<PetResponseWithUser[]>(this.petEndpoint, {
            params: queryParams,
        });
        if (isHttpException(pets.data)) throw new HttpException(pets.data);
        const convertedPets = pets.data.map(pet => this.convertData(pet));
        return convertedPets as any[];
    }

    async getPetType(): Promise<PetType[]> {
        const petTypes = await apiClient.get<PetType[]>(this.petTypeEndpoint);
        if (isHttpException(petTypes.data)) throw new HttpException(petTypes.data);
        return petTypes.data;
    }

    async getBreed({ petTypeId }: { petTypeId?: number } = {}): Promise<Breed[]> {
        const breeds = await apiClient.get<Breed[]>(this.petBreedEndpoint, {
            params: { petTypeId },
        });
        if (isHttpException(breeds.data)) throw new HttpException(breeds.data);
        return breeds.data;
    }

    async create(data: PetDto): Promise<Pet> {
        const convertedData = this.prepareDataToPush(data);

        const pet = await apiClientAuth.post<PetResponse>(this.petEndpoint, convertedData);
        if (isHttpException(pet.data)) throw new HttpException(pet.data);
        return this.convertData(pet.data);
    }

    async update({ id, data }: { id: number; data: PetDto }): Promise<Pet> {
        const convertedData = this.prepareDataToPush(data);

        const pet = await apiClientAuth.patch<PetResponse>(
            join(this.petEndpoint, id),
            convertedData,
        );
        if (isHttpException(pet.data)) throw new HttpException(pet.data);
        return this.convertData(pet.data);
    }

    async delete(id: number): Promise<Pet> {
        const pet = await apiClientAuth.delete<PetResponse>(join(this.petEndpoint, id));
        if (isHttpException(pet.data)) throw new HttpException(pet.data);
        return this.convertData(pet.data);
    }

    async setImage({ file, petId }: { file: File; petId: number }): Promise<{ image: string }> {
        const formData = new FormData();
        formData.append('image', file);

        const pet = await apiClientAuth.post(join(this.petEndpoint, 'image', petId), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (isHttpException(pet.data)) throw new HttpException(pet.data);
        return pet.data;
    }

    async deleteImage(petId: number) {
        const pet = await apiClientAuth.delete(join(this.petEndpoint, 'image', petId));
        if (isHttpException(pet.data)) throw new HttpException(pet.data);
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

    private prepareDataToPush({ birthday, image, ...data }: PetDto) {
        const convertedData: Record<keyof Omit<PetDto, 'image'>, string | number | null> = {
            ...data,
            birthday: birthday?.startOf('date').toString() ?? null,
        };

        for (const key in convertedData) {
            const k = key as keyof typeof convertedData;
            if (!convertedData[k]) convertedData[k] = null;
        }

        return convertedData;
    }
}

export default new PetService();
