import type { ReturnWithErrPromise } from '~type/common.type';
import type { LostInfo, LostInfoDto } from '~type/lost-info.type';

import dayjs from 'dayjs';
import { apiClientAuth } from '~api/api-client';
import { errorHandler, HttpException, isHttpException } from '~helper/error-handler';

type LostInfoResponse = Omit<LostInfo, 'lostAt'> & { lostAt: string | null };

class LostInfoService {
    async create(petId: number, data: LostInfoDto): ReturnWithErrPromise<LostInfo> {
        const convertedData = this.prepareDataToPush(data);

        try {
            const pet = await apiClientAuth.post<LostInfoResponse>(
                `lost-info/${petId}`,
                convertedData,
            );
            if (isHttpException(pet.data)) throw new HttpException(pet.data);
            return [this.convertData(pet.data), null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async update(petId: number, data: LostInfoDto): ReturnWithErrPromise<LostInfo> {
        const convertedData = this.prepareDataToPush(data);

        try {
            const pet = await apiClientAuth.patch<LostInfoResponse>(
                `lost-info/${petId}`,
                convertedData,
            );
            if (isHttpException(pet.data)) throw new HttpException(pet.data);
            return [this.convertData(pet.data), null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    async delete(petId: number): ReturnWithErrPromise {
        try {
            const pet = await apiClientAuth.delete<LostInfoResponse>(`lost-info/${petId}`);
            if (isHttpException(pet.data)) throw new HttpException(pet.data);
            return [null, null];
        } catch (err) {
            return errorHandler(err);
        }
    }

    private convertData(lostInfo: LostInfoResponse): LostInfo {
        const lostAt = dayjs(lostInfo.lostAt);
        return { ...lostInfo, lostAt };
    }

    private prepareDataToPush({ lostAt, ...data }: LostInfoDto) {
        return {
            details: data.details ?? null,
            address: data.address ?? null,
            lostAt: lostAt.startOf('date').toString() ?? null,
        };
    }
}

export default new LostInfoService();
