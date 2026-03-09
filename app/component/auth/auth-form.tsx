import type { FC } from 'react';
import type { CarouselRef } from 'antd/lib/carousel';

import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { Form, Input, Button, Space, Carousel, notification } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import tokenService from '~service/token.service';
import authService from '~service/auth.service';

type AuthFormProps = {
    onSuccess?: () => void | Promise<void>;
};

const checkIsEmailExist = authService.checkIsEmailExist.bind(authService);
const verifyEmail = authService.verifyEmail.bind(authService);
const signUp = authService.signUp.bind(authService);
const signIn = authService.signIn.bind(authService);

export const SignInForm: FC<AuthFormProps> = ({ onSuccess }) => {
    const [form] = Form.useForm();
    const [api, context] = notification.useNotification();

    const { mutate, isPending } = useMutation({
        mutationKey: ['sign_in'],
        mutationFn: signIn,
        onSuccess: tokens => {
            tokenService.setToken(tokens);
            if (typeof onSuccess === 'function') onSuccess();
        },
        onError: err => {
            api.error({ description: err.message });
        },
    });

    return (
        <>
            <Form form={form} onFinish={mutate} clearOnDestroy>
                <Form.Item name="email" rules={[{ required: true, message: 'Введите почту' }]}>
                    <Input size="large" placeholder="Почта" type="email" />
                </Form.Item>

                <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
                    <Input.Password size="large" placeholder="Пароль" />
                </Form.Item>

                <Button block color="cyan" variant="solid" htmlType="submit" loading={isPending}>
                    Войти
                </Button>
            </Form>

            {context}
        </>
    );
};

export const SignUpForm: FC<AuthFormProps> = ({ onSuccess }) => {
    const formSliderRef = useRef<CarouselRef>(null);

    const [form] = Form.useForm();
    const [api, context] = notification.useNotification();

    const [codeSent, setCodeSent] = useState(false);
    const [isPossibleToSent, setIsPossibleToSent] = useState(true);

    const { mutate: checkEmail, isPending: isCheckPending } = useMutation({
        mutationKey: ['check_email'],
        mutationFn: checkIsEmailExist,
        onError: err => {
            api.error({ description: err.message });
        },
        onSuccess: () => {
            formSliderRef.current?.next();
        },
    });

    const { mutate: sendCodeMutate, isPending: isCodePending } = useMutation({
        mutationKey: ['send_code'],
        mutationFn: verifyEmail,
        onError: err => {
            api.error({ description: err.message });
        },
        onSuccess: (data, email) => {
            api.success({
                description: `Код подтверждения отправлен на почту ${email}`,
            });

            setCodeSent(true);
            setIsPossibleToSent(false);
        },
    });

    const { mutate: signUpMutate, isPending: isSignUpPending } = useMutation({
        mutationKey: ['sign_up'],
        mutationFn: signUp,
        onSuccess: tokens => {
            tokenService.setToken(tokens);
            if (typeof onSuccess === 'function') onSuccess();
        },
        onError: err => {
            api.error({ description: err.message });
        },
    });

    async function submit({ code }: { code: string }) {
        signUpMutate({
            code,
            ...form.getFieldsValue(),
        });
    }

    async function sendCode() {
        const email: string = form.getFieldValue('email');
        sendCodeMutate(email);
    }

    useEffect(() => {
        let timer: any;

        if (!isPossibleToSent) {
            timer = setTimeout(() => setIsPossibleToSent(true), 60_000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [isPossibleToSent]);

    return (
        <>
            <Carousel ref={formSliderRef} dots={false} infinite={false} fade>
                <Form
                    form={form}
                    onFinish={() => checkEmail(form.getFieldValue('email'))}
                    clearOnDestroy
                >
                    <Form.Item
                        name="firstName"
                        rules={[{ required: true, message: 'Введите имя' }]}
                    >
                        <Input size="large" placeholder="Имя" />
                    </Form.Item>

                    <Form.Item name="lastName">
                        <Input size="large" placeholder="Фамилия" />
                    </Form.Item>

                    <Form.Item name="email" rules={[{ required: true, message: 'Введите почту' }]}>
                        <Input size="large" placeholder="Почта" type="email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Введите пароль' }]}
                    >
                        <Input.Password size="large" placeholder="Пароль" />
                    </Form.Item>

                    <Form.Item
                        name="repeatPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Введите пароль',
                            },
                            {
                                validator: async (_, value) => {
                                    const password = form.getFieldValue('password');
                                    if (password !== value)
                                        throw new Error('Repeat password error');
                                },
                                message: 'Пароли должны совпадать',
                            },
                        ]}
                    >
                        <Input.Password size="large" placeholder="Повторите пароль" />
                    </Form.Item>

                    <Button
                        block
                        color="cyan"
                        variant="solid"
                        htmlType="submit"
                        loading={isCheckPending}
                    >
                        Далее
                    </Button>
                </Form>

                <Form onFinish={submit} clearOnDestroy>
                    <Button
                        type="text"
                        style={{ paddingInline: 0, marginBottom: '1em' }}
                        icon={<ArrowLeftOutlined />}
                        onClick={formSliderRef.current?.prev}
                    >
                        Назад
                    </Button>

                    <Form.Item
                        name="code"
                        rules={[{ required: true, message: 'Введите код подтверждения' }]}
                    >
                        <Input size="large" placeholder="Код подтверждения" />
                    </Form.Item>

                    <Space vertical style={{ width: '100%' }}>
                        <Button
                            block
                            color="cyan"
                            variant="solid"
                            onClick={sendCode}
                            loading={isCodePending}
                            disabled={!isPossibleToSent}
                        >
                            {codeSent ? 'Отправить код повторно' : 'Отправить код'}
                        </Button>

                        <Button
                            block
                            color="cyan"
                            variant="solid"
                            htmlType="submit"
                            loading={isSignUpPending}
                        >
                            Зарегистрироваться
                        </Button>
                    </Space>
                </Form>
            </Carousel>
            {context}
        </>
    );
};
