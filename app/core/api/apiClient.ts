import type { Token } from '~type/auth.type';

import axios from 'axios';
import tokenService from '~service/token.service';

import { HttpException, isHttpException } from '~helper/error-handler';

const baseURL = import.meta.env.VITE_API_URL;

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
            // TODO: redirect to home page
            tokenService.removeToken();
            throw new HttpException(response.data);
        }

        tokenService.setToken(response.data);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

        return apiClient(originalRequest);
    }

    return response;
});

// apiClient.interceptors.request.use(async config => {
//     const token = TokenService.getToken();
//     if (token) config.headers.Authorization = `Bearer ${token.accessToken}`;
//     return config;
// });

// apiClient.interceptors.response.use(async response => {
//     const originalRequest = response.config;

//     if (isHttpException(response.data) && response.data.statusCode === 401 && !isRefreshing) {
//         isRefreshing = true;

//         const token = TokenService.getToken();

//         if (!token) {
//             throw new HttpException({ error: 'Токен не найден', statusCode: 0 });
//         }

//         const response = await apiClient.post<Token>('/auth/refresh-token', token);

//         if (isHttpException(response.data)) {
//             // TODO: redirect to home page
//             TokenService.removeToken();
//             throw new HttpException(response.data);
//         }

//         TokenService.setToken(response.data);
//         originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

//         return apiClient(originalRequest);
//     }

//     isRefreshing = false;
//     return response;
// });
