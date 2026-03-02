import type { FC } from 'react';
import type { MapMouseEvent } from '@vis.gl/react-google-maps';
import type { User, Contact, UpdateUserDto, UpdateUserFormData } from '~type/user.type';
import type { Marker } from '~component/common/google-map';

import { useState } from 'react';
import useUserStore from '~store/user.store';
import userService from '~service/user.service';

import { Modal, Form, Input, Button, notification, Select, Row } from 'antd';
import { GoogleMap } from '~component/common';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { ContactName } from '~constant/contact-links';
import { alertError } from '~helper/alert-error';

type EditPersonalInfoModalProps = {
    user: User;
    open: boolean;
    setOpen: (state: boolean) => void;
};

type AdditionalContactOption = { label: string; value: string };

const EditPersonalInfoModal: FC<EditPersonalInfoModalProps> = ({ user, open, setOpen }) => {
    const [form] = Form.useForm();
    const { setUser } = useUserStore(state => state);

    const [loading, setLoading] = useState(false);
    const [additionalContacts, setAdditionalContacts] = useState(
        user.contacts?.map(contact => contact.name) ?? [],
    );

    const [api, context] = notification.useNotification();

    const contactOptions = Object.values(ContactName).map(
        name => ({ label: name, value: name }) as AdditionalContactOption,
    );

    function onChangeContacts(data: string[]) {
        setAdditionalContacts(data);
    }

    async function submit(data: UpdateUserFormData) {
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
                <Form onFinish={submit} form={form} preserve>
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
                            marginBottom: 'var(--form-item-margin-bottom)',
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

                    <MapSelection address={user.address} />

                    <Button block color="cyan" variant="solid" htmlType="submit" loading={loading}>
                        Сохранить
                    </Button>
                </Form>
            </Modal>

            {context}
        </>
    );
};

const MapSelection: FC<{ address: User['address'] }> = ({ address }) => {
    const form = Form.useFormInstance();

    const coordinate =
        address?.latitude && address?.longitude
            ? { lat: address.latitude, lng: address?.longitude }
            : undefined;

    const [mark, setMark] = useState<Marker[] | undefined>(
        coordinate ? [coordinate] : undefined,
    );

    function selectMark(e: MapMouseEvent) {
        const coords: Marker = e.detail.latLng;

        setMark([coords]);
        form.setFieldsValue({ latitude: coords.lat, longitude: coords.lng });
    }

    function clearMark() {
        setMark(undefined);
        form.setFieldsValue({ latitude: null, longitude: null });
    }

    return (
        <div style={{ marginBottom: 'var(--form-item-margin-bottom)' }}>
            <Form.Item name="latitude" initialValue={address?.latitude} hidden>
                <Input placeholder="latitude" />
            </Form.Item>

            <Form.Item name="longitude" initialValue={address?.longitude} hidden>
                <Input placeholder="longitude" />
            </Form.Item>

            <Row>
                <GoogleMap
                    onClick={selectMark}
                    markers={mark}
                    defaultZoom={coordinate ? 18 : 12}
                    defaultCenter={coordinate}
                    style={{
                        height: 200,
                        marginBottom: 'var(--form-item-margin-bottom)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--border-radius)',
                    }}
                />
            </Row>

            <Row>
                <Button block disabled={!mark} color="cyan" variant="filled" onClick={clearMark}>
                    Удалить метку
                </Button>
            </Row>
        </div>
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
                const [, name] = key.split(';');
                contacts.push({ name, value: value.toString() });
            }
        }

        return contacts;
    }

    return updatedUser;
}

export default EditPersonalInfoModal;
