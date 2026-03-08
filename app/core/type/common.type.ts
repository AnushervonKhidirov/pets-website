import type { CSSProperties, PropsWithChildren } from 'react';

export type WithAdditionalProps<T = unknown> = PropsWithChildren<
    { className?: string; style?: CSSProperties } & T
>;

export type PaginationQuery = {
    skip?: number;
    take?: number;
};

export type MessageDataDto = {
    topic: string;
    phone: string;
    message: string;
};
