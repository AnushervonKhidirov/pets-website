import type { FC } from 'react';
import type { User, Contact, UpdateUserDto, UpdateUserFormData } from '~type/user.type';
import type { Marker } from '~component/common/google-map';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useUserInfo } from '~hook/use-user-info';

import userService from '~service/user.service';

import { Form, Input, Button, notification, Select, Space, Typography } from 'antd';
import { Container, GoogleMap } from '~component/common';
import { isValidPhoneNumber } from 'libphonenumber-js';

import { AuthType } from '~type/user.type';
import { ContactName } from '~constant/contact-links';

import classes from './profile-setting.module.css';

export function meta() {
    return [{ title: 'Настройки профиля' }];
}

type AdditionalContactOption = { label: string; value: string };

const { Title } = Typography;

const updateUserInfo = userService.update.bind(userService);

const Profile = () => {
    const [form] = Form.useForm();
    const { query, setData: setUser } = useUserInfo();

    const [additionalContacts, setAdditionalContacts] = useState(
        query.data?.contacts ? query.data.contacts?.map(contact => contact.name) : [],
    );

    const [api, context] = notification.useNotification();

    const contactOptions = Object.values(ContactName).map(
        name => ({ label: name, value: name }) as AdditionalContactOption,
    );

    const { mutate, isPending } = useMutation({
        mutationKey: ['update_user_info'],
        mutationFn: updateUserInfo,
        onSuccess: setUser,
        onError: err => {
            api.error({ description: err.message });
        },
    });

    function onChangeContacts(data: string[]) {
        setAdditionalContacts(data);
    }

    async function submit(data: UpdateUserFormData) {
        const updatedUserData = convertUserData(data);
        mutate(updatedUserData);
    }

    return (
        query.isSuccess && (
            <Container section style={{ minHeight: '100%' }}>
                <Title level={3}>Настройки</Title>

                <Form
                    form={form}
                    requiredMark={false}
                    onFinish={submit}
                    layout="vertical"
                    className={classes.form}
                >
                    <Space size="middle" vertical styles={{ root: { width: '100%' } }}>
                        <div className={classes.inputs}>
                            <Form.Item
                                name="firstName"
                                rules={[{ required: true }]}
                                initialValue={query.data.firstName}
                                label="Имя"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="lastName"
                                initialValue={query.data.lastName}
                                label="Фамилия"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Номер телефона"
                                initialValue={query.data.phone}
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
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="address"
                                initialValue={query.data.address?.address}
                                label="Адрес"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item label="Доплнительные контакты" className={classes.contacts}>
                                <Select
                                    mode="multiple"
                                    placeholder="Выберите дополнительные контакты"
                                    defaultValue={query.data.contacts?.map(contact => contact.name)}
                                    options={contactOptions}
                                    onChange={onChangeContacts}
                                    style={{
                                        width: '100%',
                                        marginBottom: 'var(--form-item-margin-bottom)',
                                    }}
                                />

                                {additionalContacts.map(name => {
                                    return (
                                        <Form.Item
                                            name={`contacts;${name}`}
                                            initialValue={
                                                query.data.contacts?.find(
                                                    contact => contact.name === name,
                                                )?.value
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message: `Введите имя пользователя ${name}`,
                                                },
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
                            </Form.Item>
                        </div>

                        <MapSelection address={query.data.address} />

                        <Space styles={{ root: { width: '100%', justifyContent: 'end' } }}>
                            <Button
                                color="cyan"
                                variant="filled"
                                onClick={() => form.resetFields()}
                            >
                                Откатить изменения
                            </Button>

                            <Button
                                color="cyan"
                                variant="solid"
                                htmlType="submit"
                                loading={isPending}
                            >
                                Сохранить
                            </Button>
                        </Space>

                        <Space styles={{ root: { width: '100%', justifyContent: 'end' } }}>
                            {query.data.authType === AuthType.Local && (
                                <Button color="orange" variant="solid">
                                    Поменять пароль
                                </Button>
                            )}
                        </Space>
                    </Space>
                </Form>

                {context}
            </Container>
        )
    );
};

const MapSelection: FC<{ address: User['address'] }> = ({ address }) => {
    const form = Form.useFormInstance();
    const [changed, setChanged] = useState(false);

    const coordinate =
        address?.latitude && address?.longitude
            ? { lat: address.latitude, lng: address?.longitude }
            : undefined;

    const [mark, setMark] = useState<Marker[] | undefined>(coordinate ? [coordinate] : undefined);

    function selectMark(coords: Marker | undefined) {
        if (!coords) return clearMark();

        setMark([coords]);
        form.setFieldsValue({ latitude: coords.lat, longitude: coords.lng });
    }

    function clearMark() {
        setMark(undefined);
        form.setFieldsValue({ latitude: null, longitude: null });
    }

    function isChanged() {
        const latitude = form.getFieldValue('latitude') ?? null;
        const longitude = form.getFieldValue('longitude') ?? null;

        const initialLatitude = address?.latitude ?? null;
        const initialLongitude = address?.longitude ?? null;

        return initialLatitude !== latitude || initialLongitude !== longitude;
    }

    useEffect(() => {
        setChanged(isChanged);
    }, [form.getFieldValue('latitude'), form.getFieldValue('longitude')]);

    return (
        <>
            <Form.Item name="latitude" initialValue={address?.latitude} hidden>
                <Input placeholder="latitude" />
            </Form.Item>

            <Form.Item name="longitude" initialValue={address?.longitude} hidden>
                <Input placeholder="longitude" />
            </Form.Item>

            <GoogleMap
                onClick={e => selectMark(e.detail.latLng)}
                disableDefaultUI
                markers={mark}
                defaultZoom={coordinate ? 18 : 12}
                defaultCenter={coordinate}
                style={{
                    height: 'auto',
                    aspectRatio: '1/0.35',
                    minHeight: 200,
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius)',
                }}
            >
                <Space style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    {mark && (
                        <Button size="small" color="cyan" variant="solid" onClick={clearMark}>
                            Удалить метку
                        </Button>
                    )}

                    {changed && (
                        <Button
                            size="small"
                            color="cyan"
                            variant="solid"
                            onClick={() => selectMark(coordinate)}
                        >
                            Откатить
                        </Button>
                    )}
                </Space>
            </GoogleMap>
        </>
    );
};

function convertUserData(data: UpdateUserFormData): UpdateUserDto {
    const updatedUser: UpdateUserDto = {
        firstName: data.firstName,
        lastName: data.lastName ?? null,
        phone: data.phone ?? null,
        address: getAddress(),
        contacts: getContacts(),
    };

    function getAddress() {
        if (!('address' in data) && !('latitude' in data) && !('longitude' in data)) return null;

        return {
            address: data.address ?? null,
            latitude: data.latitude ?? null,
            longitude: data.longitude ?? null,
        };
    }

    function getContacts() {
        const contacts: Contact[] = [];

        for (const [key, value] of Object.entries(data)) {
            if (key.startsWith('contacts;') && value) {
                const stringValue = typeof value === 'number' ? value.toString() : value;
                const [, name] = key.split(';');
                contacts.push({ name, value: stringValue });
            }
        }

        return contacts;
    }

    return updatedUser;
}

export default Profile;
