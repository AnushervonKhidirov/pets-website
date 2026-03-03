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
    let message = 'Упс!';
    let details = 'Произошла непредвиденная ошибка.';

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? '404' : 'Ошибка';
        details = error.status === 404 ? 'Страница не найдена.' : error.statusText || details;
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
                },
                content: {
                    display: 'grid',
                    alignContent: 'center',
                    justifyContent: 'center',
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
