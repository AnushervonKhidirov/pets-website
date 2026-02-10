import { HttpException } from '~helper/error-handler';

export type WithClassName = { className?: string };

export type ReturnWithErr<T = null> = [T, null] | [null, HttpException];
export type ReturnWithErrPromise<T = null> = Promise<ReturnWithErr<T>>;
