import type { FC, ChangeEvent } from 'react';
import type { LostPet } from '~type/pet.type';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from '@tanstack/pacer';
import petService from '~service/pet.service';

import { Link } from 'react-router';
import { Typography, Pagination, Button, Input } from 'antd';
import { Card, Container, ErrorInfo, Grid, Loader, PhoneLink, Empty } from '~component/common';
import { LostPetInfoCard } from '~component/pet/pet-info-card';
import { SearchIcon } from '~icons';

import { Route } from '~constant/route';
import { light } from '~/config/ant.config';

export function meta() {
    return [{ title: 'Потерянные питомцы' }];
}

const pageSize = 12;
const { Title, Text } = Typography;

async function fetchPets(page: number = 0, search?: string) {
    return (await petService.getAll({
        lost: true,
        take: pageSize,
        skip: page * pageSize,
        name: search,
        microchipId: search,
    })) as LostPet[];
}

const Lost = () => {
    const [currPage, setCurrPage] = useState(1);
    const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

    const {
        isPending,
        isError,
        isSuccess,
        error,
        data: pets,
    } = useQuery({
        queryKey: ['lost_pet', currPage, searchValue],
        queryFn: fetchPets.bind(null, currPage - 1, searchValue),
    });

    const {
        isPending: isCountPending,
        isSuccess: isCountSuccess,
        data: lostCount,
    } = useQuery({
        queryKey: ['lost_pet_count'],
        queryFn: petService.count.bind(petService, { lost: true }),
    });

    if (isError) return <ErrorInfo error={error} />;

    return (
        <Container
            section
            color={light}
            styles={{
                wrapper: { minHeight: '100%', gridTemplateRows: '1fr' },
                content: {
                    display: 'grid',
                    height: '100%',
                    gap: '2rem',
                    gridTemplateRows: 'max-content max-content auto max-content',
                },
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <Title level={2} style={{ marginBottom: '0.75rem' }}>
                    Потерянные питомцы
                </Title>

                <Text>
                    Помогите найти пропавших животных. Если вы видели кого-то из них,
                    <br /> пожалуйста, свяжитесь с владельцем.
                </Text>
            </div>

            <FilterBlock setInputValue={setSearchValue} setCurrPage={setCurrPage} />

            {isPending || (isCountPending && <Loader />)}

            {isSuccess && isCountSuccess && (
                <PetList
                    pets={pets}
                    totalPets={lostCount.total}
                    currPage={currPage}
                    paginationHandler={setCurrPage}
                />
            )}
        </Container>
    );
};

const PetList: FC<{
    pets: LostPet[];
    totalPets: number;
    currPage: number;
    paginationHandler: (page: number) => void;
}> = ({ pets, totalPets, currPage, paginationHandler }) => {
    return pets.length > 0 ? (
        <>
            <div>
                <Grid>
                    {pets.map(pet => (
                        <LostPetInfoCard
                            pet={pet}
                            style={{ height: '100%' }}
                            key={'lost_pet' + pet.id}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '0.5rem 1rem',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <Link
                                    to={`${Route.PetInfo}/${pet.id}`}
                                    target="_blank"
                                    style={{ flexGrow: 1 }}
                                >
                                    <Button color="default" variant="solid" block>
                                        Подробнее
                                    </Button>
                                </Link>

                                {pet.user.phone && (
                                    <PhoneLink
                                        phone={pet.user.phone}
                                        asButton
                                        includeIcon
                                        style={{ flexGrow: 1 }}
                                        buttonProps={{
                                            color: 'orange',
                                            variant: 'solid',
                                            block: true,
                                        }}
                                    />
                                )}
                            </div>
                        </LostPetInfoCard>
                    ))}
                </Grid>
            </div>

            <Pagination
                current={currPage}
                pageSize={pageSize}
                total={totalPets}
                hideOnSinglePage
                showSizeChanger={false}
                align="center"
                onChange={paginationHandler}
            />
        </>
    ) : (
        <Empty />
    );
};

const FilterBlock: FC<{
    setInputValue: (value: string | undefined) => void;
    setCurrPage: (page: number) => void;
}> = ({ setInputValue, setCurrPage }) => {
    const inputHandler = debounce(
        async (e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.trim() === '' ? undefined : e.target.value;
            setInputValue(value);
            setCurrPage(1);
        },
        { wait: 500 },
    );

    return (
        <Card color="#fff" size="small">
            <Input
                size="large"
                placeholder="Поиск по имени или чипу"
                prefix={<SearchIcon style={{ marginRight: '0.25em' }} />}
                onChange={inputHandler}
            />
        </Card>
    );
};

export default Lost;
