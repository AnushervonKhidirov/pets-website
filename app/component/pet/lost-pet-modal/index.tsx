import type { FC } from 'react';
import type { LostInfo, LostInfoDto } from '~type/lost-info.type';
import type { Pet } from '~type/pet.type';

import { useState } from 'react';
import lostInfoService from '~service/lost-info.service';

import { Modal, Form, Input, Button, DatePicker, notification } from 'antd';
import dayjs from 'dayjs';
import { alertError } from '~helper/alert-error';

import classes from './lost-pet-modal.module.css';

type EditPersonalInfoModalProps = {
    pet: Pet;
    lostInfo?: LostInfo | null;
    open: boolean;
    setOpen: (state: boolean) => void;
    onSuccess?: (pet: Pet) => void;
};

const LostInfoModal: FC<EditPersonalInfoModalProps> = ({
    pet,
    lostInfo,
    open,
    setOpen,
    onSuccess,
}) => {
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [loadingRemove, setLoadingRemove] = useState(false);

    const [api, context] = notification.useNotification();

    async function submit(data: LostInfoDto) {
        setLoading(true);

        const [lostInfo, err] = await lostInfoHandler(pet.id, data);

        if (err) {
            api.error(alertError(err));
        } else {
            form.resetFields();
            if (onSuccess) onSuccess({ ...pet, lostInfo: lostInfo });
        }

        setLoading(false);

        setTimeout(() => setOpen(false), 500);
    }

    async function remove() {
        setLoadingRemove(true);

        const [, err] = await lostInfoService.delete(pet.id);

        if (err) {
            api.error(alertError(err));
        } else if (onSuccess) {
            onSuccess({ ...pet, lostInfo: null });
        }

        setLoadingRemove(false);
        setTimeout(() => setOpen(false), 500);
    }

    async function lostInfoHandler(petId: number, data: LostInfoDto) {
        if (lostInfo) {
            return await lostInfoService.update(petId, data);
        } else {
            return await lostInfoService.create(petId, data);
        }
    }

    return (
        <>
            <Modal
                title="Заявление о пропаже"
                open={open}
                onCancel={() => setOpen(false)}
                centered
                footer={null}
                destroyOnHidden
            >
                <Form form={form} onFinish={submit} preserve>
                    <Form.Item name="address" initialValue={lostInfo?.address ?? null}>
                        <Input placeholder="Адрес" />
                    </Form.Item>

                    <Form.Item name="details" initialValue={lostInfo?.details ?? null}>
                        <Input placeholder="Подробности" />
                    </Form.Item>

                    <Form.Item
                        name="lostAt"
                        initialValue={lostInfo?.lostAt ?? dayjs()}
                        rules={[{ required: true, message: 'Укажите дату пропажи' }]}
                    >
                        <DatePicker
                            format={{ format: 'DD/MM/YYYY' }}
                            placeholder="День пропажи (день/месяц/год)"
                            allowClear
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <div className={classes.buttons}>
                        {lostInfo && (
                            <Button danger type="primary" loading={loadingRemove} onClick={remove}>
                                Удалить объявление
                            </Button>
                        )}

                        <Button color="cyan" variant="solid" htmlType="submit" loading={loading}>
                            {lostInfo ? 'Сохранить объявление' : 'Создать объявление'}
                        </Button>
                    </div>
                </Form>
            </Modal>

            {context}
        </>
    );
};

export default LostInfoModal;
