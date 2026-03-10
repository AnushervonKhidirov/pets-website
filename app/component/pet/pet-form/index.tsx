import type { FC } from 'react';
import type { Breed, PetDto, Pet } from '~type/pet.type';

import { useLayoutEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import petService from '~service/pet.service';

import {
    Form,
    Input,
    Select,
    DatePicker,
    Upload,
    Button,
    Typography,
    notification,
    Space,
} from 'antd';
import { Card, Image } from '~component/common';
import ImgCrop from 'antd-img-crop';
import { DeleteOutlined, UndoOutlined } from '@ant-design/icons';

import { Sex } from '~type/pet.type';
import { sex } from '~constant/pet';
import { reduceSize } from '~helper/image.helper';
import dayjs from 'dayjs';

import classes from './pet-form.module.css';

import placeholder from 'src/images/pet-placeholder.png';
import classNames from 'classnames';

type PetFormProps = {
    pet?: Pet | null;
    onSuccess?: (pet: Pet) => void;
};

const { Text } = Typography;

const createPet = petService.create.bind(petService);
const updatePet = petService.update.bind(petService);
const setImage = petService.setImage.bind(petService);
const deleteImage = petService.deleteImage.bind(petService);

const getPetType = petService.getPetType.bind(petService);
const getBreed = petService.getBreed.bind(petService);

const PetForm: FC<PetFormProps> = ({ pet, onSuccess }) => {
    const initialPetImage = pet?.image ?? null;
    const queryClient = useQueryClient();

    const [form] = Form.useForm();
    const [api, context] = notification.useNotification();
    const [petImage, setPetImage] = useState(initialPetImage);

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
                <Form
                    form={form}
                    requiredMark={false}
                    onFinish={submit}
                    layout="vertical"
                    variant="underlined"
                    className={classes.form}
                >
                    <Card className={classes.input_wrapper}>
                        <div className={classes.inputs}>
                            <Form.Item
                                name="name"
                                label="Кличка"
                                rules={[{ required: true, message: 'Введите кличку питомца' }]}
                                initialValue={pet?.name ?? null}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="petTypeId"
                                label="Вид животного"
                                rules={[{ required: true, message: 'Выберите вид животное' }]}
                                initialValue={pet?.petTypeId ?? null}
                            >
                                <Select
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

                            <Form.Item
                                name="breedId"
                                label="Порода"
                                initialValue={pet?.breedId ?? null}
                            >
                                <Select
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

                            <Form.Item name="sex" label="Пол" initialValue={pet?.sex ?? null}>
                                <Select options={sexOptions} allowClear />
                            </Form.Item>

                            <Form.Item
                                name="birthday"
                                label={
                                    <>
                                        День рождение <Text type="secondary">(день/месяц/год)</Text>
                                    </>
                                }
                                initialValue={pet?.birthday ?? null}
                            >
                                <DatePicker
                                    placeholder={dayjs().format('DD/MM/YYYY')}
                                    format={{ format: 'DD/MM/YYYY' }}
                                    allowClear
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="microchipId"
                                label="Номер чипа"
                                initialValue={pet?.microchipId ?? null}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="about"
                                label="Описание"
                                initialValue={pet?.about ?? null}
                            >
                                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
                            </Form.Item>
                        </div>

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
                                <Upload.Dragger
                                    beforeUpload={async file => {
                                        setPetImage(URL.createObjectURL(file));
                                        return (await reduceSize(file)) as File;
                                    }}
                                    customRequest={({ file, onSuccess }) => {
                                        form.setFieldValue('image', file);
                                        if (onSuccess) onSuccess('ok');
                                    }}
                                    onRemove={() => {
                                        form.setFieldValue('image', null);
                                    }}
                                    name="image"
                                    listType="picture-card"
                                    maxCount={1}
                                    accept="image/png, image/jpeg, image/jpg"
                                    fileList={[]}
                                >
                                    Загрузить фотографию
                                </Upload.Dragger>
                            </ImgCrop>
                        </Form.Item>
                    </Card>

                    <Card contentStyles={{ padding: 0, aspectRatio: '1 / 0.5' }}>
                        <Space
                            styles={{
                                root: { position: 'absolute', right: '0.5rem', top: '0.5rem' },
                            }}
                        >
                            {initialPetImage === petImage && (
                                <Button
                                    color="cyan"
                                    variant="filled"
                                    icon={<UndoOutlined />}
                                    onClick={() => {
                                        form.resetFields(['image']);
                                        setPetImage(initialPetImage);
                                    }}
                                />
                            )}

                            {petImage && (
                                <Button
                                    color="cyan"
                                    variant="filled"
                                    icon={<DeleteOutlined />}
                                    onClick={() => {
                                        setPetImage(null);
                                        form.setFieldValue('image', null);
                                    }}
                                />
                            )}
                        </Space>

                        <Image
                            src={petImage ?? placeholder}
                            cover={!!petImage}
                            alt="Pet"
                            className={classNames(classes.image, {
                                [classes.placeholder]: !petImage,
                            })}
                        />
                    </Card>

                    <Space styles={{ root: { width: '100%', justifyContent: 'end' } }}>
                        {pet && (
                            <Button
                                color="cyan"
                                variant="filled"
                                onClick={() => {
                                    form.resetFields();
                                    setPetImage(initialPetImage);
                                }}
                            >
                                Откатить изменения
                            </Button>
                        )}

                        <Button
                            color="cyan"
                            variant="solid"
                            onClick={() => form.submit()}
                            loading={isCreatePending || isUpdatePending}
                        >
                            Сохранить
                        </Button>
                    </Space>
                </Form>

                {context}
            </>
        )
    );
};

export default PetForm;
