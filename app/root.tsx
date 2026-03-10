import type { FC, PropsWithChildren } from 'react';
import type { LinksFunction } from 'react-router';
import type { Route } from './+types/root';

import { Meta, Links, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';

import { ErrorInfo } from '~component/common';

import { themeConfig } from './config/ant.config';
import './config/dayjs.config';

import rootStyles from './styles/root.css?url';
import fontsStyles from './styles/fonts.css?url';

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 0, refetchOnWindowFocus: false } },
});

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: rootStyles },
    { rel: 'stylesheet', href: fontsStyles },
];

export const Layout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className="custom-ant">
                <ConfigProvider theme={themeConfig} locale={ruRU}>
                    <APIProvider apiKey={API_KEY} language="ru">
                        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                    </APIProvider>
                </ConfigProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
};

const App = () => {
    return <Outlet />;
};

export const ErrorBoundary: FC<Route.ErrorBoundaryProps> = ({ error }) => {
    return (
        <main>
            <ErrorInfo error={error} />
        </main>
    );
};

export default App;
