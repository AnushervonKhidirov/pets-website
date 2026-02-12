import type { FC } from 'react';
import type { User, Contact, UpdateUserDto } from '~type/user.type';

import { useState } from 'react';
import useUserStore from '~store/user.store';
import userService from '~service/user.service';

import { Modal, Form, Input, Button, notification, Select } from 'antd';
import { alertError } from '~commons/alert-error/alert-error';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { ContactName, isContactItem } from '~constant/contact-links';

type EditPersonalInfoModalProps = {
    user: User;
    open: boolean;
    setOpen: (state: boolean) => void;
};

const EditPersonalInfoModal: FC<EditPersonalInfoModalProps> = ({ user, open, setOpen }) => {
    const { setUser } = useUserStore(state => state);

    const [loading, setLoading] = useState(false);
    const [additionalContacts, setAdditionalContacts] = useState<ContactName[]>(
        user.contacts?.map(contact => contact.name) ?? [],
    );

    const [api, context] = notification.useNotification();

    const contactOptions = Object.values(ContactName).map(name => ({ label: name, value: name }));

    function onChangeContacts(data: ContactName[]) {
        setAdditionalContacts(data);
    }

    async function submit(data: Record<string, string>) {
        setLoading(true);

        const updatedUserData = convertUserData(data);
        const [newUserData, err] = await userService.update(updatedUserData);

        if (err) {
            api.error(alertError(err));
        } else {
            setUser(newUserData);
            setOpen(false);
        }

        setLoading(false);
    }

    return (
        <>
            <Modal
                title="Редактирование"
                open={open}
                onCancel={() => setOpen(false)}
                centered
                footer={null}
                destroyOnHidden
            >
                <Form onFinish={submit}>
                    <Form.Item
                        name="firstName"
                        rules={[{ required: true }]}
                        initialValue={user.firstName}
                    >
                        <Input placeholder="Имя" />
                    </Form.Item>

                    <Form.Item name="lastName" initialValue={user.lastName}>
                        <Input placeholder="Фамилия" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        initialValue={user.phone}
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

                    <Form.Item name="address" initialValue={user.address?.address}>
                        <Input placeholder="Адрес" />
                    </Form.Item>

                    <Select
                        mode="multiple"
                        placeholder="Выберите дополнительные контакты"
                        defaultValue={user.contacts?.map(contact => contact.name)}
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
                                initialValue={
                                    user.contacts?.find(contact => contact.name === name)?.value
                                }
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

function convertUserData(data: Record<string, string>): UpdateUserDto {
    const updatedUser: UpdateUserDto = {};
    const contacts: Contact[] = [];

    for (const [key, value] of Object.entries(data)) {
        const keyTest = key as keyof Omit<UpdateUserDto, 'contacts' | 'address'>;

        if (!value) {
            updatedUser[keyTest] = null;
            continue;
        }

        if (key === 'address') {
            updatedUser.address = { address: value };
            continue;
        }

        if (key.startsWith('contacts;')) {
            const [, name] = key.split(';');
            if (isContactItem(name)) contacts.push({ name, value });
            continue;
        }

        updatedUser[keyTest] = value;
    }

    updatedUser.contacts = contacts.length > 0 ? contacts : null;

    return updatedUser;
}

export default EditPersonalInfoModal;
