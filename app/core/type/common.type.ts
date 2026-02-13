import type { PropsWithChildren } from 'react';
import { HttpException } from '~helper/error-handler';

export type WithClassName<T = unknown> = { className?: string } & T;
export type WithAdditionalProps<T = unknown> = PropsWithChildren<WithClassName<T>>;

export type ReturnWithErr<T = null> = [T, null] | [null, HttpException];
export type ReturnWithErrPromise<T = null> = Promise<ReturnWithErr<T>>;
