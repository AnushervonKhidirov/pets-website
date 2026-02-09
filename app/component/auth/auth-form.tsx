import type { SignInDto, SignUpDto } from '~type/auth.type';

import { Form, Input, Button } from 'antd';

export const SignInForm = () => {
    async function submit(data: SignInDto) {
        console.log(data);
    }

    return (
        <Form onFinish={submit}>
            <Form.Item name="email" rules={[{ required: true, message: 'Введите почту' }]}>
                <Input size="large" placeholder="Почта" type="email" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
                <Input.Password size="large" placeholder="Пароль" />
            </Form.Item>

            <Button block color="cyan" variant="solid" htmlType="submit">
                Войти
            </Button>
        </Form>
    );
};

export const SignUpForm = () => {
    async function submit(data: SignUpDto) {
        console.log(data);
    }

    return (
        <Form onFinish={submit}>
            <Form.Item name="email" rules={[{ required: true, message: 'Введите почту' }]}>
                <Input size="large" placeholder="Почта" type="email" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
                <Input.Password size="large" placeholder="Пароль" />
            </Form.Item>

            <Form.Item
                name="password_repeat"
                rules={[{ required: true, message: 'Введите пароль' }]}
            >
                <Input.Password size="large" placeholder="Повторите пароль" />
            </Form.Item>

            <Button block color="cyan" variant="solid" htmlType="submit">
                Зарегистрироваться
            </Button>
        </Form>
    );
};
