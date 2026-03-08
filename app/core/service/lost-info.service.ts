import type { LostInfo, LostInfoDto } from '~type/lost-info.type';

import dayjs from 'dayjs';
import { join } from '~helper/path.helper';
import { apiClientAuth } from '~api/api-client';
import { HttpException, isHttpException } from '~helper/error-handler';

type LostInfoResponse = Omit<LostInfo, 'lostAt'> & { lostAt: string | null };

class LostInfoService {
    private readonly endpoint = 'lost-info';

    async set({ petId, data }: { petId: number; data: LostInfoDto }): Promise<LostInfo> {
        const pet = await apiClientAuth.post<LostInfoResponse>(
            join(this.endpoint, petId),
            this.prepareDataToPush(data),
        );

        if (isHttpException(pet.data)) throw new HttpException(pet.data);
        return this.convertData(pet.data);
    }

    async delete(petId: number) {
        const pet = await apiClientAuth.delete<LostInfoResponse>(join(this.endpoint, petId));
        if (isHttpException(pet.data)) throw new HttpException(pet.data);
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
