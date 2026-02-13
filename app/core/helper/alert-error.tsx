import type { ReactNode } from 'react';
import type { HttpException } from '~helper/error-handler';

export function alertError(err: HttpException): { title: ReactNode; description?: ReactNode } {
    const Message = () => {
        const message = err.message;
        if (Array.isArray(message)) {
            return (
                <div>
                    {message.map(messageItem => {
                        return <div key={messageItem}>{messageItem};</div>;
                    })}
                </div>
            );
        }

        return err.message ?? null;
    };

    return { title: err.error, description: <Message /> };
}
