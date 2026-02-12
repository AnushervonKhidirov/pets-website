import type { FC } from 'react';
import type { User, Contact, UpdateUserDto } from '~type/user.type';

import { useState } from 'react';
import useUserStore from '~store/user.store';
import userService from '~service/user.service';

import { Modal, Form, Input, Button, notification, Select } from 'antd';
import { alertError } from '~commons/alert-error/alert-error';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { ContactName } from '~constant/contact-links';

type EditPersonalInfoModalProps = {
    user: User;
    open: boolean;
    setOpen: (state: boolean) => void;
};

const EditPersonalInfoModal: FC<EditPersonalInfoModalProps> = ({ user, open, setOpen }) => {
    const { setUser } = useUserStore(state => state);

    const [loading, setLoading] = useState(false);
    const [additionalContacts, setAdditionalContacts] = useState<ContactName[]>([]);

    const [api, context] = notification.useNotification();

    const contactOptions = Object.values(ContactName).map(name => ({ label: name, value: name }));

    function onChangeContacts(data: ContactName[]) {
        setAdditionalContacts(data);
    }

    function closeModal() {
        setOpen(false);
    }

    async function submit(data: Record<string, unknown>) {
        setLoading(true);

        const updatedUserData = convertContactData(data);
        const [newUserData, err] = await userService.update(updatedUserData);

        if (err) {
            api.error(alertError(err));
        } else {
            setUser(newUserData);
        }

        setLoading(false);
    }

    return (
        <>
            <Modal
                title="Редактирование"
                open={open}
                onCancel={() => closeModal()}
                centered
                footer={null}
            >
                <Form onFinish={submit}>
                    <Form.Item name="firstName" rules={[{ required: true }]}>
                        <Input placeholder="Имя" />
                    </Form.Item>

                    <Form.Item name="lastName">
                        <Input placeholder="Фамилия" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        rules={[
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
                        <Input placeholder="Номер телефона" />
                    </Form.Item>

                    <Form.Item name="address">
                        <Input placeholder="Адрес" />
                    </Form.Item>

                    <Select
                        mode="multiple"
                        placeholder="Выберите дополнительные контакты"
                        defaultValue={user.contacts.map(contact => contact.name as ContactName)}
                        options={contactOptions}
                        onChange={onChangeContacts}
                        style={{
                            width: '100%',
                            marginBottom: 'var(--ant-form-item-margin-bottom)',
                        }}
                    />

                    {additionalContacts.map(name => {
                        return (
                            <Form.Item
                                name={`contacts;${name}`}
                                rules={[
                                    { required: true, message: `Введите имя пользователя ${name}` },
                                ]}
                                key={name}
                            >
                                <Input
                                    placeholder={name}
                                    prefix="@"
                                    styles={{ prefix: { margin: 0 } }}
                                />
                            </Form.Item>
                        );
                    })}

                    <Button block color="cyan" variant="solid" htmlType="submit" loading={loading}>
                        Сохранить
                    </Button>
                </Form>
            </Modal>

            {context}
        </>
    );
};

function convertContactData(data: Record<string, unknown>): UpdateUserDto {
    const updatedUser: UpdateUserDto = {};
    const contacts: Contact[] = [];

    for (const [key, value] of Object.entries(data)) {
        if (key.startsWith('contacts;') && typeof value === 'string') {
            const [, name] = key.split(';');
            contacts.push({ name, value: '@' + value });
            continue;
        }

        if (key === 'address' && typeof value === 'string') {
            updatedUser.address = { address: value };
            continue;
        }

        const stringValueKey = key as keyof Omit<UpdateUserDto, 'contacts' | 'address'>;

        if (key && typeof value === 'string') {
            updatedUser[stringValueKey] = value;
            continue;
        }

        updatedUser[stringValueKey] = null;
    }

    if (contacts.length > 0) updatedUser.contacts = JSON.stringify(contacts);

    return updatedUser;
}

export default EditPersonalInfoModal;
