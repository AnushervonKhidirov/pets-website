import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import userService from '~service/user.service';

import { Button, Modal, Form, Input, notification } from 'antd';
import { Card } from '~component/common';

const changePassword = userService.changePassword.bind(userService);

const ChangePasswordBtn = () => {
    const [form] = Form.useForm();
    const [api, context] = notification.useNotification();

    const [open, setOpen] = useState(false);

    const { mutate } = useMutation({
        mutationKey: ['change_password'],
        mutationFn: changePassword,
        onSuccess: () => {
            api.success({ description: 'Пароль успешно заменен' });
            setOpen(false);
        },
        onError: err => {
            api.error({ description: err.message });
        },
    });

    return (
        <>
            <Button color="orange" variant="solid" onClick={() => setOpen(true)}>
                Поменять пароль
            </Button>

            <Modal
                title="Смена пароля"
                open={open}
                onCancel={() => setOpen(false)}
                centered
                destroyOnHidden
                footer={null}
            >
                <Card>
                    <Form form={form} onFinish={mutate} variant="underlined" clearOnDestroy>
                        <Form.Item
                            name="oldPassword"
                            rules={[{ required: true, message: 'Введите текущий пароль' }]}
                        >
                            <Input.Password size="large" placeholder="Текущий пароль" />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            rules={[{ required: true, message: 'Введите новый пароль' }]}
                        >
                            <Input.Password size="large" placeholder="Пароль" />
                        </Form.Item>

                        <Form.Item
                            name="repeatNewPassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'Повторите новый пароль',
                                },
                                {
                                    validator: async (_, value) => {
                                        const password = form.getFieldValue('newPassword');
                                        if (password !== value)
                                            throw new Error('Repeat password error');
                                    },
                                    message: 'Пароли должны совпадать',
                                },
                            ]}
                        >
                            <Input.Password size="large" placeholder="Повторите пароль" />
                        </Form.Item>

                        <Button block color="cyan" variant="solid" htmlType="submit">
                            Поменять пароль
                        </Button>
                    </Form>
                </Card>
            </Modal>

            {context}
        </>
    );
};

export default ChangePasswordBtn;
