import type { FC } from 'react';
import type { ButtonProps as AntBtnProps } from 'antd';
import type { Pet } from '~type/pet.type';

import { useState } from 'react';
import useMyPetsStore from '~store/my-pets.store';
import petService from '~service/pet.service';

import { Button, Popconfirm, notification } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors';
import { WarningIcon } from '~icons';
import PetModal from './pet-modal';
import LostInfoModal from './lost-pet-modal';
import { alertError } from '~helper/alert-error';

type ButtonProps = AntBtnProps & {
    pet: Pet;
    hideText?: boolean;
};

export const DeletePetButton: FC<ButtonProps> = ({ pet, hideText, ...props }) => {
    const [api, context] = notification.useNotification();

    const { deletePet } = useMyPetsStore(state => state);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showPopconfirm = () => {
        setOpen(true);
    };

    async function handleOk() {
        setConfirmLoading(true);

        const [, err] = await petService.delete(pet.id);

        if (err) {
            api.error(alertError(err));
        } else {
            setTimeout(() => deletePet(pet.id), 500);
        }

        setConfirmLoading(false);
        setTimeout(() => setOpen(false), 500);
    }

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <Popconfirm
                title="Удалить питомца?"
                description={`Питомец ${pet.name} будет удален`}
                icon={<WarningIcon style={{ color: red.primary }} />}
                placement="topRight"
                arrow={false}
                open={open}
                okText="Удалить"
                okButtonProps={{ loading: confirmLoading, type: 'primary', danger: true }}
                cancelText="Отмена"
                onConfirm={handleOk}
                onCancel={handleCancel}
            >
                <Button
                    danger
                    type="primary"
                    onClick={showPopconfirm}
                    icon={<DeleteOutlined />}
                    {...props}
                >
                    {!hideText && 'Удалить'}
                </Button>
            </Popconfirm>

            {context}
        </>
    );
};

export const CratePetButton: FC<Omit<ButtonProps, 'pet'>> = ({ hideText, ...props }) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Button
                color="cyan"
                variant="solid"
                onClick={() => setModalOpen(true)}
                icon={<PlusOutlined />}
                {...props}
            >
                {!hideText && 'Добавить'}
            </Button>

            <PetModal open={modalOpen} setOpen={setModalOpen} />
        </>
    );
};

export const EditPetButton: FC<ButtonProps> = ({ pet, hideText, ...props }) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Button
                color="cyan"
                variant="solid"
                onClick={() => setModalOpen(true)}
                icon={<EditOutlined />}
                {...props}
            >
                {!hideText && 'Редактировать'}
            </Button>

            <PetModal pet={pet} open={modalOpen} setOpen={setModalOpen} />
        </>
    );
};

export const LostPetButton: FC<ButtonProps> = ({ pet, hideText, ...props }) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Button
                danger={!pet.lostInfo}
                color="cyan"
                type="primary"
                variant="solid"
                onClick={() => setModalOpen(true)}
                {...props}
            >
                Объявление о пропаже
            </Button>

            <LostInfoModal
                petId={pet.id}
                lostInfo={pet.lostInfo}
                open={modalOpen}
                setOpen={setModalOpen}
            />
        </>
    );
};
