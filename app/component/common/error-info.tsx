import type { FC } from 'react';

import { isRouteErrorResponse } from 'react-router';
import { isHttpException } from '~helper/error-handler';

import { Typography } from 'antd';
import Container from './container';

import funnyCat from 'src/images/funny-cat.png';

const { Title, Text } = Typography;

type ErrorInfoProps = {
    error?: unknown;
};

const ErrorInfo: FC<ErrorInfoProps> = ({ error }) => {
    let message = 'Oops!';
    let details = 'An unexpected error occurred.';

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? '404' : 'Error';
        details =
            error.status === 404
                ? 'The requested page could not be found.'
                : error.statusText || details;
    }

    if (isHttpException(error)) {
        message = error.statusCode === 404 ? '404' : error.error;
        details = Array.isArray(error.message)
            ? error.message.join('; ')
            : error.message || details;
    }

    return (
        <Container
            section
            styles={{
                wrapper: {
                    minHeight: '100%',
                    display: 'grid',
                    alignContent: 'center',
                    justifyContent: 'center',
                },
                content: {
                    display: 'grid',
                    gap: '1.5rem',
                },
            }}
        >
            <img src={funnyCat} alt="funny cat" style={{ maxWidth: 250 }} />

            <div style={{ textAlign: 'center' }}>
                <Title style={{ marginBottom: '0.5rem' }}>{message}</Title>
                <Text>{details}</Text>
            </div>
        </Container>
    );
};

export default ErrorInfo;
