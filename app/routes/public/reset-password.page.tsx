import type { Route } from './+types/reset-password.page';

import { useParams } from 'react-router';
// import { useQuery, useMutation } from '@tanstack/react-query';

import { Form, Input, Button, Typography } from 'antd';
import { Container, Card } from '~component/common';
import { light } from '~/config/ant.config';

export function meta() {
    return [{ title: 'Восстановить пароль' }];
}

const { Title } = Typography;

const ResetPasswordPage = () => {
    const [form] = Form.useForm();
    const params = useParams<Route.LoaderArgs['params']>();

    // const {} = useQuery({ queryKey: ['check_params_id'] });
    // const {} = useMutation({ mutationKey: ['reset_password'] });

    return (
        <main>
            <Container
                color={light}
                maxWidth={600}
                styles={{
                    wrapper: { minHeight: '100%', alignContent: 'center' },
                }}
            >
                <Card>
                    <Title level={3}>Восстановление пароля</Title>

                    <Form form={form} variant="underlined">
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Введите новый пароль' }]}
                        >
                            <Input.Password size="large" placeholder="Новый пароль" />
                        </Form.Item>

                        <Form.Item
                            name="repeatPassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'Введите повторно пароль пароль',
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
                            <Input.Password size="large" placeholder="Повторите новый пароль" />
                        </Form.Item>

                        <Button block color="cyan" variant="solid" htmlType="submit">
                            Сменить пароль
                        </Button>
                    </Form>
                </Card>
            </Container>
        </main>
    );
};

export default ResetPasswordPage;
