import type { FC, PropsWithChildren } from 'react';
import type { Route } from './+types/root';

import { isRouteErrorResponse, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { themeConfig } from './config/ant.config';
import './config/dayjs.config';

import './styles/fonts.css';
import './styles/root.css';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });

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
    let message = 'Oops!';
    let details = 'An unexpected error occurred.';
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? '404' : 'Error';
        details =
            error.status === 404
                ? 'The requested page could not be found.'
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
};

export default App;
