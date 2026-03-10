import type { Route } from './+types/reset-password.page';

import { useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import resetPasswordService from '~service/reset-password.service';

import { Form, Input, Button, Typography, notification } from 'antd';
import { Container, Card, Loader, ErrorInfo } from '~component/common';

export function meta() {
    return [{ title: 'Восстановить пароль' }];
}

const checkPageId = resetPasswordService.checkPageId.bind(resetPasswordService);
const reset = resetPasswordService.reset.bind(resetPasswordService);

const { Title } = Typography;

const ResetPasswordPage = () => {
    const [form] = Form.useForm();
    const params = useParams<Route.LoaderArgs['params']>();
    const [api, context] = notification.useNotification();

    const {
        isPending: isCheckPending,
        isError: isCheckError,
        error: checkError,
    } = useQuery({
        queryKey: ['check_params_id'],
        queryFn: checkPageId.bind(null, params.pageId ?? ''),
    });

    const { mutate, isPending } = useMutation({
        mutationKey: ['reset_password'],
        mutationFn: reset,
        onSuccess: () => {
            api.success({ description: 'Пароль успешно восстановлен' });
        },
        onError: err => {
            const description = Array.isArray(err.message) ? err.message.join('; ') : err.message;
            api.error({ description });
        },
    });

    function submit({ password }: { password: string }) {
        mutate({ pageId: params.pageId ?? '', password });
    }

    if (isCheckPending)
        return (
            <main>
                <Loader />
            </main>
        );
    if (isCheckError)
        return (
            <main>
                <ErrorInfo error={checkError} />
            </main>
        );

    return (
        <main>
            <Container
                maxWidth={600}
                styles={{
                    wrapper: { minHeight: '100%', alignContent: 'center' },
                }}
            >
                <Card>
                    <Title level={3}>Восстановление пароля</Title>

                    <Form form={form} onFinish={submit}>
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

                        <Button
                            block
                            color="cyan"
                            variant="solid"
                            htmlType="submit"
                            loading={isPending}
                        >
                            Сменить пароль
                        </Button>
                    </Form>
                </Card>
            </Container>

            {context}
        </main>
    );
};

export default ResetPasswordPage;
