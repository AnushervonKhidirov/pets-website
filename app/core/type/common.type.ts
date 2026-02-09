import { HttpException } from '~helper/error-handler';

export type WithClassName = { className?: string };

export type ReturnWithErr<T> = [T, null] | [null, HttpException];
export type ReturnWithErrPromise<T = unknown> = Promise<ReturnWithErr<T>>;
