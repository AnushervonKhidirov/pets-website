import type { FC, PropsWithChildren } from 'react';
import type { Route } from './+types/root';

import { Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { ConfigProvider } from 'antd';
import { ErrorInfo } from '~component/common';
import ruRU from 'antd/locale/ru_RU';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { themeConfig } from './config/ant.config';
import './config/dayjs.config';

import './styles/fonts.css';
import './styles/root.css';

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 0, refetchOnWindowFocus: false } },
});

export const Layout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
            </head>
            <body className="custom-ant">
                <ConfigProvider theme={themeConfig} locale={ruRU}>
                    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
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
