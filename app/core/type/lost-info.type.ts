import type { Dayjs } from 'dayjs';

export type LostInfo = {
    petId: number;
    address: string | null;
    details: string | null;
    lostAt: Dayjs;
};

export type LostInfoDto = Omit<LostInfo, 'petId'>;
