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

    if (isHttpException(response.data) && response.data.statusCode === 401) {
        const token = tokenService.getToken();

        if (!token) {
            throw new HttpException({ error: 'Token not found', statusCode: 0 });
        }

        const response = await apiClient.post<Token>('/auth/refresh-token', token);

        if (isHttpException(response.data)) {
            tokenService.removeToken();
            if (isInPrivate()) globalThis.location.replace('/');
            throw new HttpException(response.data);
        }

        tokenService.setToken(response.data);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

        return apiClient(originalRequest);
    }

    return response;
});
