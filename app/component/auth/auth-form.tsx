import type { FC } from 'react';
import type { SignInDto, SignUpDto } from '~type/auth.type';

import { Form, Input, Button, notification } from 'antd';

import { useState } from 'react';

import authService from '~service/auth.service';
import { alertError } from '~commons/alert-error/alert-error';

type AuthFormProps = {
    onSuccess?: () => void;
};

export const SignInForm: FC<AuthFormProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [api, context] = notification.useNotification();

    async function submit(data: SignInDto) {
        setLoading(true);

        const [tokens, err] = await authService.signIn(data);
        if (err) api.error(alertError(err));

        if (tokens) {
            if (typeof onSuccess === 'function') onSuccess();
        }

        setLoading(false);
    }

    return (
        <>
            <Form onFinish={submit}>
                <Form.Item name="email" rules={[{ required: true, message: 'Введите почту' }]}>
                    <Input size="large" placeholder="Почта" type="email" />
                </Form.Item>

                <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
                    <Input.Password size="large" placeholder="Пароль" />
                </Form.Item>

                <Button block color="cyan" variant="solid" htmlType="submit" loading={loading}>
                    Войти
                </Button>
            </Form>

            {context}
        </>
    );
};

export const SignUpForm: FC<AuthFormProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [api, context] = notification.useNotification();
    const [form] = Form.useForm();

    async function submit({ repeatPassword, ...data }: SignUpDto & { repeatPassword: string }) {
        setLoading(true);

        const [tokens, err] = await authService.signUp(data);
        if (err) api.error(alertError(err));

        if (tokens) {
            if (typeof onSuccess === 'function') onSuccess();
        }

        setLoading(false);
    }

    return (
        <>
            <Form onFinish={submit} form={form}>
                <Form.Item name="firstName" rules={[{ required: true, message: 'Введите имя' }]}>
                    <Input size="large" placeholder="Имя" />
                </Form.Item>

                <Form.Item name="lastName">
                    <Input size="large" placeholder="Фамилия" />
                </Form.Item>

                <Form.Item name="email" rules={[{ required: true, message: 'Введите почту' }]}>
                    <Input size="large" placeholder="Почта" type="email" />
                </Form.Item>

                <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
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
                                if (password !== value) throw new Error('Repeat password error');
                            },
                            message: 'Пароли должны совпадать',
                        },
                    ]}
                >
                    <Input.Password size="large" placeholder="Повторите пароль" />
                </Form.Item>

                <Button block color="cyan" variant="solid" htmlType="submit" loading={loading}>
                    Зарегистрироваться
                </Button>
            </Form>

            {context}
        </>
    );
};
