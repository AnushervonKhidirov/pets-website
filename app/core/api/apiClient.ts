import type { Token } from '~type/auth.type';

import axios from 'axios';
import tokenService from '~service/token.service';
import { PrivateRoutes } from '~constant/route';
import { HttpException, isHttpException } from '~helper/error-handler';

const baseURL = import.meta.env.VITE_API_URL;

function isInPrivate() {
    let isPrivate = false;

    for (const route of PrivateRoutes) {
        if (globalThis.location.pathname.includes(route)) {
            isPrivate = true;
            break;
        }
    }

    return isPrivate;
}

export const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    validateStatus: () => true,
});

export const apiClientAuth = apiClient.create();

apiClientAuth.interceptors.request.use(async config => {
    const token = tokenService.getToken();
    if (token) config.headers.Authorization = `Bearer ${token.accessToken}`;
    return config;
});

apiClientAuth.interceptors.response.use(async response => {
    const originalRequest = response.config;

    if (!isHttpException(response.data)) return response;

    if (response.data.statusCode === 401) {
        const token = tokenService.getToken();

        if (!token) {
            throw new HttpException({ error: 'Token not found', statusCode: 0 });
        }

        const responseRefreshed = await apiClient.post<Token | HttpException>(
            '/auth/refresh-token',
            token,
        );

        if (isHttpException(responseRefreshed.data)) {
            tokenService.removeToken();
            if (isInPrivate()) globalThis.location.replace('/');
            throw new HttpException(responseRefreshed.data);
        }

        tokenService.setToken(responseRefreshed.data);
        originalRequest.headers.Authorization = `Bearer ${responseRefreshed.data.accessToken}`;

        return apiClient(originalRequest);
    }

    tokenService.removeToken();
    if (isInPrivate()) globalThis.location.replace('/');
    throw new HttpException(response.data);
});
