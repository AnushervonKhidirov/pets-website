import type { FC, ReactNode, CSSProperties } from 'react';
import type { ButtonProps } from 'antd';

import { useState } from 'react';
import useUserStore from '~store/user.store';
import userService from '~service/user.service';

import { Modal, Button, notification } from 'antd';
import { SignInForm, SignUpForm } from './auth-form';
import { GoogleOAuthButton } from './oauth-button';
import { alertError } from '~commons/alert-error/alert-error';

type AuthModalProps = {
    open: boolean;
    setOpen: (state: boolean) => void;
    contentType: AuthContent;
};

type AuthFooterProps = { content: AuthContent; setContent: (state: AuthContent) => void };
export type AuthContent = 'sign_in' | 'sign_up';

const AuthModal: FC<AuthModalProps> = ({ open, setOpen, contentType }) => {
    const { setUser } = useUserStore(state => state);
    const [content, setContent] = useState<AuthContent>(contentType);

    const [api, context] = notification.useNotification();

    const title: Record<AuthContent, string> = {
        sign_in: 'Вход',
        sign_up: 'Регистрация',
    };

    function afterOpenHandler(isOpen: boolean) {
        if (!isOpen) setContent(contentType);
    }

    async function closeModal() {
        const [user, err] = await userService.getMe();
        if (err) {
            api.error(alertError(err));
        } else {
            setUser(user);
        }

        setOpen(false);
    }

    return (
        <>
            <Modal
                afterOpenChange={afterOpenHandler}
                title={title[content]}
                open={open}
                onCancel={closeModal}
                centered
                footer={<AuthFooter content={content} setContent={setContent} />}
                style={{ maxWidth: 400 }}
            >
                {content === 'sign_in' ? (
                    <SignInForm onSuccess={closeModal} />
                ) : (
                    <SignUpForm onSuccess={closeModal} />
                )}

                <div style={OAuthWrapperStyle}>
                    <GoogleOAuthButton block />
                </div>
            </Modal>

            {context}
        </>
    );
};

const AuthFooter: FC<AuthFooterProps> = ({ content, setContent }) => {
    const buttonProps = {
        style: { paddingInline: 0 },
        variant: 'link',
        color: 'orange',
    } satisfies ButtonProps;

    const footer: Record<AuthContent, ReactNode> = {
        sign_in: (
            <>
                Нет аккаунта?{' '}
                <Button {...buttonProps} onClick={setContent.bind(null, 'sign_up')}>
                    Зарегистрироваться
                </Button>
            </>
        ),
        sign_up: (
            <>
                Уже есть аккаунт?{' '}
                <Button {...buttonProps} onClick={setContent.bind(null, 'sign_in')}>
                    Войти
                </Button>
            </>
        ),
    };

    return <div>{footer[content]}</div>;
};

const OAuthWrapperStyle: CSSProperties = {
    marginTop: '1.5rem',
    display: 'grid',
    gap: '0.5rem',
};

export default AuthModal;
