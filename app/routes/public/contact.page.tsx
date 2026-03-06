import type { MessageDataDto } from '~type/common.type';

import { useState } from 'react';
import messageService from '~service/message.service';

import { Form, Input, Select, Button, Typography, notification } from 'antd';
import { Container, Card } from '~component/common';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { alertError } from '~helper/alert-error';

export function meta() {
    return [{ title: 'Связаться с нами' }];
}

const { Title, Paragraph } = Typography;

const topics = [
    {
        value: 'Ошибка',
        label: 'Сообщить об ошибке',
    },
    {
        value: 'Предложение',
        label: 'Предложение по улучшению',
    },
    {
        value: 'Жалоба',
        label: 'Жалоба на контент',
    },
    {
        value: 'Пожертвования/Благотворительность',
        label: 'Пожертвования/Благотворительность',
    },
    {
        value: 'Другое',
        label: 'Другое',
    },
];

const Contact = () => {
    const [form] = Form.useForm();
    const [api, context] = notification.useNotification();
    const [loading, setLoading] = useState(false);

    async function submit(data: MessageDataDto) {
        setLoading(true);

        const [, err] = await messageService.send(data);
        if (err) {
            api.error(alertError(err));
        } else {
            form.resetFields();
            api.success({ title: 'Сообщение', description: 'Успешно доставлено' });
        }

        setLoading(false);
    }

    return (
        <Container
            section
            styles={{
                wrapper: {
                    minHeight: '100%',
                },
            }}
        >
            <Card>
                <Title level={2}>Связаться с нами</Title>

                <Paragraph style={{ fontSize: '1.2em' }}>
                    Наш сервис создан для того, чтобы у каждого домашнего животного был цифровой
                    паспорт. Мы предоставляем возможность <b>бесплатно</b> создать аккаунт питомца,
                    чтобы нашедший его человек мог мгновенно считать QR-код и связаться с
                    владельцем.
                </Paragraph>

                <Paragraph style={{ fontSize: '1.2em' }}>
                    Если у вас есть вопросы по работе личного кабинета, предложения или вы заметили
                    ошибку — напишите нам. Проект поддерживается волонтерами, поэтому любое ваше{' '}
                    <b>пожертвование</b> пойдет напрямую на оплату серверов и развитие новых функций
                    сайта, чтобы профили ваших любимцев всегда оставались доступны.
                </Paragraph>

                <Paragraph type="warning" style={{ fontSize: '1.2em' }}>
                    Обратите внимание, что цифровой паспорт <b>не является официальным</b>{' '}
                    ветеринарным или юридическим документом.
                </Paragraph>

                <Form form={form} onFinish={submit}>
                    <Form.Item name="topic" rules={[{ required: true, message: 'Выберите тему' }]}>
                        <Select size="large" placeholder="Тема" options={topics} allowClear />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        rules={[
                            { required: true, message: 'Введите номер телефона' },
                            {
                                validator: async (_, value) => {
                                    if (value && !isValidPhoneNumber(value, 'TJ')) {
                                        throw new Error('Wrong phone format');
                                    }
                                },
                                message: 'Неправильный формат номера',
                            },
                        ]}
                    >
                        <Input size="large" placeholder="Номер телефона" />
                    </Form.Item>

                    <Form.Item
                        name="message"
                        rules={[{ required: true, message: 'Напишите сообщение' }]}
                    >
                        <Input.TextArea
                            size="large"
                            placeholder="Сообщение"
                            autoSize={{ minRows: 2, maxRows: 3 }}
                        />
                    </Form.Item>

                    <Button htmlType="submit" color="cyan" variant="solid" loading={loading}>
                        Отправить
                    </Button>
                </Form>
            </Card>

            {context}
        </Container>
    );
};

export default Contact;
