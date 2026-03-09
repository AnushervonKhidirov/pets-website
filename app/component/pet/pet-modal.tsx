import type { FC } from 'react';
import type { UploadProps } from 'antd';
import type { Breed, PetDto, Pet } from '~type/pet.type';

import { useLayoutEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import petService from '~service/pet.service';

import { Modal, Form, Input, Select, DatePicker, Upload, Button, notification } from 'antd';
import { Card } from '~component/common';
import ImgCrop from 'antd-img-crop';

import { Sex } from '~type/pet.type';
import { sex } from '~constant/pet';
import { reduceSize } from '~helper/image.helper';

type PetModalProps = {
    open: boolean;
    setOpen: (state: boolean) => void;
    pet?: Pet | null;
    onSuccess?: (pet: Pet) => void;
};

const createPet = petService.create.bind(petService);
const updatePet = petService.update.bind(petService);
const setImage = petService.setImage.bind(petService);
const deleteImage = petService.deleteImage.bind(petService);

const getPetType = petService.getPetType.bind(petService);
const getBreed = petService.getBreed.bind(petService);

const PetModal: FC<PetModalProps> = ({ pet, open, setOpen, onSuccess }) => {
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [api, context] = notification.useNotification();

    const defaultFileList: UploadProps['fileList'] = pet?.image
        ? [
              {
                  uid: '-1',
                  name: 'placeholder',
                  status: 'done',
                  url: pet.image,
              },
          ]
        : undefined;

    const [breedsFiltered, setBreedsFiltered] = useState<Breed[]>([]);

    const sexOptions = (Object.keys(sex) as Sex[]).map(key => ({
        value: key,
        label: sex[key].ru,
    }));

    async function submit(data: PetDto) {
        if (pet) {
            updatePetMutate({ id: pet.id, data });
        } else {
            createPetMutate(data);
        }
    }

    function successCallback(pet: Pet) {
        if (onSuccess) onSuccess(pet);
        setOpen(false);
    }

    const { mutate: createPetMutate, isPending: isCreatePending } = useMutation({
        mutationKey: ['pet_data'],
        mutationFn: createPet,
        onSuccess: (pet, { image }) => {
            if (image) {
                setImageMutate({ file: image, petId: pet.id });
            } else successCallback(pet);
        },
        onError: error => {
            api.error({ description: error.message });
        },
    });

    const { mutate: updatePetMutate, isPending: isUpdatePending } = useMutation({
        mutationKey: ['pet_data'],
        mutationFn: updatePet,
        onSuccess: (pet, { data }) => {
            if (data.image) {
                setImageMutate({ file: data.image, petId: pet.id });
            } else if (data.image === null) {
                deleteImageMutate(pet.id);
            } else successCallback(pet);
        },
        onError: error => {
            api.error({ description: error.message });
        },
    });

    const { mutate: setImageMutate } = useMutation({
        mutationKey: ['set_pet_img'],
        mutationFn: setImage,
        onSuccess: ({ image }) => {
            const pet = queryClient.getMutationCache().find<Pet>({ mutationKey: ['pet_data'] });
            if (pet?.state.data) successCallback({ ...pet.state.data, image });
        },
        onError: error => {
            api.error({ description: error.message });
        },
    });

    const { mutate: deleteImageMutate } = useMutation({
        mutationKey: ['delete_pet_img'],
        mutationFn: deleteImage,
        onSuccess: () => {
            const pet = queryClient.getMutationCache().find<Pet>({ mutationKey: ['pet_data'] });
            if (pet?.state.data) successCallback({ ...pet.state.data, image: null });
        },
        onError: error => {
            api.error({ description: error.message });
        },
    });

    const {
        mutate: petTypeMutate,
        isSuccess: isPetTypeSuccess,
        data: petTypes,
    } = useMutation({
        mutationKey: ['pet_types'],
        mutationFn: getPetType,
        onError: error => {
            api.error({ description: error.message });
            setOpen(false);
        },
    });

    const {
        mutate: breedMutate,
        isSuccess: isBreedsSuccess,
        data: breeds,
    } = useMutation({
        mutationKey: ['breeds'],
        mutationFn: getBreed,
        onSuccess: breeds => {
            const filteredBreeds = pet
                ? breeds.filter(breed => breed.petTypeId === pet.petTypeId)
                : breeds;

            setBreedsFiltered(filteredBreeds);
        },
        onError: error => {
            api.error({ description: error.message });
            setOpen(false);
        },
    });

    useLayoutEffect(() => {
        petTypeMutate();
        breedMutate({});
    }, []);

    return (
        isPetTypeSuccess &&
        isBreedsSuccess && (
            <>
                <Modal
                    title={pet ? 'Редактирование питомца' : 'Создать питомца'}
                    open={open}
                    onCancel={() => setOpen(false)}
                    centered
                    footer={null}
                >
                    <Card>
                        <Form form={form} onFinish={submit} variant="underlined" clearOnDestroy>
                            <Form.Item
                                name="name"
                                rules={[{ required: true, message: 'Введите кличку питомца' }]}
                                initialValue={pet?.name ?? null}
                            >
                                <Input placeholder="Кличка" />
                            </Form.Item>

                            <Form.Item
                                name="petTypeId"
                                rules={[{ required: true, message: 'Выберите вид животное' }]}
                                initialValue={pet?.petTypeId ?? null}
                            >
                                <Select
                                    placeholder="Вид"
                                    options={petTypes.map(({ id, ru }) => ({
                                        value: id,
                                        label: ru,
                                    }))}
                                    allowClear
                                    onChange={id => {
                                        form.setFieldValue('breedId', null);

                                        const filteredBreeds = id
                                            ? breeds.filter(breed => breed.petTypeId === id)
                                            : breeds;

                                        setBreedsFiltered(filteredBreeds);
                                    }}
                                />
                            </Form.Item>

                            <Form.Item name="breedId" initialValue={pet?.breedId ?? null}>
                                <Select
                                    placeholder="Порода"
                                    options={breedsFiltered.map(({ id, ru }) => ({
                                        value: id,
                                        label: ru,
                                    }))}
                                    allowClear
                                    showSearch={{
                                        filterOption: (inputValue, option) =>
                                            option?.label
                                                .toUpperCase()
                                                .indexOf(inputValue.toUpperCase()) !== -1,
                                    }}
                                />
                            </Form.Item>

                            <Form.Item name="sex" initialValue={pet?.sex ?? null}>
                                <Select placeholder="Пол" options={sexOptions} allowClear />
                            </Form.Item>

                            <Form.Item name="birthday" initialValue={pet?.birthday ?? null}>
                                <DatePicker
                                    format={{ format: 'DD/MM/YYYY' }}
                                    placeholder="День рождение (день/месяц/год)"
                                    allowClear
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item name="microchipId" initialValue={pet?.microchipId ?? null}>
                                <Input placeholder="Номер чипа" />
                            </Form.Item>

                            <Form.Item name="about" initialValue={pet?.about ?? null}>
                                <Input.TextArea
                                    placeholder="Описание"
                                    autoSize={{ minRows: 1, maxRows: 3 }}
                                />
                            </Form.Item>

                            <Form.Item name="image" hidden>
                                <Input />
                            </Form.Item>

                            <Form.Item>
                                <ImgCrop
                                    aspect={1 / 0.55}
                                    quality={1}
                                    modalTitle="Обрезка изображения"
                                    showGrid
                                    modalOk="Обрезать"
                                    modalCancel="Закрыть"
                                    modalProps={{ centered: true }}
                                >
                                    <Upload
                                        beforeUpload={async file => {
                                            return (await reduceSize(file)) as File;
                                        }}
                                        customRequest={({ file, onSuccess }) => {
                                            form.setFieldValue('image', file);
                                            onSuccess!('ok');
                                        }}
                                        onRemove={() => {
                                            form.setFieldValue('image', null);
                                        }}
                                        name="image"
                                        listType="picture-card"
                                        maxCount={1}
                                        accept="image/png, image/jpeg, image/jpg"
                                        defaultFileList={defaultFileList}
                                    >
                                        Загрузить фотографию
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>

                            <Button
                                block
                                color="cyan"
                                variant="solid"
                                onClick={() => form.submit()}
                                loading={isCreatePending || isUpdatePending}
                            >
                                Сохранить
                            </Button>
                        </Form>
                    </Card>
                </Modal>
                {context}
            </>
        )
    );
};

export default PetModal;
