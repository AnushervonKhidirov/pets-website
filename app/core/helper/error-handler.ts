type HttpExceptionProps = { error?: string; statusCode?: number; message?: string | string[] };

export class HttpException {
    statusCode: number;
    error: string;
    message?: string | string[];

    constructor({ statusCode, error, message }: HttpExceptionProps = {}) {
        this.statusCode = statusCode ?? 0;
        this.error = error ?? 'Unknown Error';
        this.message = message;
    }
}

export function isHttpException(err: unknown): err is HttpException {
    const isErrorObj = err && typeof err === 'object';
    const isHttpError = isErrorObj && 'statusCode' in err && 'error' in err;

    if (isHttpError && typeof err.statusCode === 'number' && err.statusCode >= 300) {
        return true;
    }

    return false;
}

export function errorHandler(err: unknown): [null, HttpException] {
    if (err instanceof HttpException) return [null, err];
    return [null, new HttpException()];
}
