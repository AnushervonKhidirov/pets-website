import type { CSSProperties, PropsWithChildren } from 'react';
import { HttpException } from '~helper/error-handler';

export type WithAdditionalProps<T = unknown> = PropsWithChildren<
    { className?: string; style?: CSSProperties } & T
>;

export type ReturnWithErr<T = null> = [T, null] | [null, HttpException];
export type ReturnWithErrPromise<T = null> = Promise<ReturnWithErr<T>>;

export type PaginationQuery = {
    skip?: number;
    take?: number;
};
