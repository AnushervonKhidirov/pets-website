import type { FC } from 'react';
import type { ButtonProps as AntBtnProps } from 'antd';
import type { Pet } from '~type/pet.type';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import petService from '~service/pet.service';

import { Button, Popconfirm, notification } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors';
import { WarningIcon } from '~icons';
import PetModal from './pet-modal';
import LostInfoModal from './lost-pet-modal';

type ButtonProps = AntBtnProps & {
    pet: Pet;
    onSuccess?: (pet: Pet) => void;
};

const deletePet = petService.delete.bind(petService);

export const DeletePetButton: FC<ButtonProps> = ({ pet, onSuccess, ...props }) => {
    const [api, context] = notification.useNotification();
    const [open, setOpen] = useState(false);

    const showPopconfirm = () => {
        setOpen(true);
    };

    const { mutate, isPending } = useMutation({
        mutationKey: ['delete_pet'],
        mutationFn: deletePet,
        onSuccess: pet => {
            if (onSuccess) onSuccess(pet);
        },
        onError: error => {
            api.error({ description: error.message });
        },
        onSettled: () => {
            setOpen(false);
        },
    });

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
                okButtonProps={{ loading: isPending, type: 'primary', danger: true }}
                cancelText="Отмена"
                onConfirm={() => mutate(pet.id)}
                onCancel={handleCancel}
            >
                <Button
                    danger
                    type="primary"
                    onClick={showPopconfirm}
                    icon={<DeleteOutlined />}
                    {...props}
                >
                    Удалить
                </Button>
            </Popconfirm>

            {context}
        </>
    );
};

export const EditPetButton: FC<ButtonProps> = ({ pet, onSuccess, ...props }) => {
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
                Редактировать
            </Button>

            <PetModal pet={pet} open={modalOpen} setOpen={setModalOpen} onSuccess={onSuccess} />
        </>
    );
};

export const LostPetButton: FC<ButtonProps> = ({ pet, onSuccess, ...props }) => {
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
                pet={pet}
                lostInfo={pet.lostInfo}
                open={modalOpen}
                setOpen={setModalOpen}
                onSuccess={onSuccess}
            />
        </>
    );
};
