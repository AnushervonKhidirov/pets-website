import type { FC } from 'react';
import type { LostInfo } from '~type/lost-info.type';
import type { Pet } from '~type/pet.type';

import { useMutation } from '@tanstack/react-query';
import lostInfoService from '~service/lost-info.service';

import { Modal, Form, Input, Button, DatePicker, Space, notification } from 'antd';
import { Card } from '~component/common';
import dayjs from 'dayjs';

type EditPersonalInfoModalProps = {
    pet: Pet;
    lostInfo?: LostInfo | null;
    open: boolean;
    setOpen: (state: boolean) => void;
    onSuccess?: (pet: Pet) => void;
};

const setLost = lostInfoService.set.bind(lostInfoService);
const deleteLost = lostInfoService.delete.bind(lostInfoService);

const LostInfoModal: FC<EditPersonalInfoModalProps> = ({
    pet,
    lostInfo,
    open,
    setOpen,
    onSuccess,
}) => {
    const [form] = Form.useForm();

    const [api, context] = notification.useNotification();

    const { mutate: setMutate, isPending: isSetPending } = useMutation({
        mutationKey: ['set_lost'],
        mutationFn: setLost,
        onSuccess: lostInfo => {
            if (onSuccess) onSuccess({ ...pet, lostInfo });
            setOpen(false);
        },
        onError: error => {
            api.error({ description: error.message });
        },
    });

    const { mutate: removeMutate, isPending: isRemovePending } = useMutation({
        mutationKey: ['delete_leo'],
        mutationFn: deleteLost,
        onSuccess: () => {
            if (onSuccess) onSuccess({ ...pet, lostInfo: null });
            setOpen(false);
        },
        onError: error => {
            api.error({ description: error.message });
        },
    });

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
                <Card>
                    <Form
                        form={form}
                        onFinish={data => setMutate({ petId: pet.id, data })}
                        variant="underlined"
                    >
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

                        <Space styles={{ root: { width: '100%' }, item: { flexGrow: 1 } }} wrap>
                            {lostInfo && (
                                <Button
                                    block
                                    danger
                                    type="primary"
                                    loading={isRemovePending}
                                    onClick={() => removeMutate(pet.id)}
                                >
                                    Удалить объявление
                                </Button>
                            )}

                            <Button
                                block
                                color="cyan"
                                variant="solid"
                                htmlType="submit"
                                loading={isSetPending}
                            >
                                {lostInfo ? 'Сохранить объявление' : 'Создать объявление'}
                            </Button>
                        </Space>
                    </Form>
                </Card>
            </Modal>

            {context}
        </>
    );
};

export default LostInfoModal;
