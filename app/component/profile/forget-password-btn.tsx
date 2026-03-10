import type { FC, MouseEvent } from 'react';
import type { ButtonProps } from 'antd';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import resetPasswordService from '~service/reset-password.service';

import { Button, Modal, Form, Input, notification } from 'antd';
import { Card } from '~component/common';

const getResetPasswordUrl = resetPasswordService.sendUrl.bind(resetPasswordService);

const ForgetPasswordBtn: FC<ButtonProps> = ({ children, ...props }) => {
    const [form] = Form.useForm();
    const [api, context] = notification.useNotification();

    const [open, setOpen] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationKey: ['reset_password_url'],
        mutationFn: getResetPasswordUrl,
        onSuccess: (data, { email }) => {
            api.success({
                description: `Ссылка на восстановление пароля отправлена на почту ${email}`,
            });
            setOpen(false);
        },
        onError: err => {
            api.error({ description: err.message });
        },
    });

    function onBtnClick(e: MouseEvent<HTMLElement>) {
        if (props.onClick) props.onClick(e);
        setOpen(true);
    }

    return (
        <>
            <Button color="orange" variant="link" {...props} onClick={onBtnClick}>
                {children ?? 'Забыли пароль?'}
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
                            name="email"
                            rules={[{ required: true, message: 'Введите почту' }]}
                        >
                            <Input placeholder="Почта" type="email" />
                        </Form.Item>

                        <Button
                            block
                            color="cyan"
                            variant="solid"
                            htmlType="submit"
                            loading={isPending}
                        >
                            Отправить
                        </Button>
                    </Form>
                </Card>
            </Modal>

            {context}
        </>
    );
};

export default ForgetPasswordBtn;
