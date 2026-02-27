import type { LostPet } from '~type/pet.type';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import petService from '~service/pet.service';

import { Link } from 'react-router';
import { Typography, Pagination, Button } from 'antd';
import { Container, ErrorInfo, Grid, Loader, PhoneLink } from '~component/common';
import { LostPetInfoCard } from '~component/pet/pet-info-card';

import { Route } from '~constant/route';
import { light } from '~/config/ant.config';

export function meta() {
    return [{ title: 'Lost pets' }];
}

const pageSize = 12;
const { Title, Text } = Typography;

async function getTotalPets() {
    const [lostPetCount, err] = await petService.count({ lost: true });
    if (err) throw err;
    return lostPetCount;
}

const Lost = () => {
    const [currPage, setCurrPage] = useState(1);

    const {
        isPending,
        isError,
        isSuccess,
        error,
        data: pets,
    } = useQuery({
        queryKey: ['lost_pet', currPage],
        queryFn: fetchPets.bind(null, currPage - 1),
    });

    const {
        isPending: isCountPending,
        isSuccess: isCountSuccess,
        data: lostCount,
    } = useQuery({
        queryKey: ['lost_pet_count'],
        queryFn: getTotalPets,
    });

    async function fetchPets(page: number = 0) {
        const [pets, err] = await petService.getAll({
            lost: true,
            take: pageSize,
            skip: page * pageSize,
        });

        if (err) throw err;
        return pets as LostPet[];
    }

    function paginationHandler(page: number) {
        setCurrPage(page);
    }

    if (isPending || isCountPending) return <Loader />;
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
                    gridTemplateRows: 'max-content auto max-content',
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

            <div>
                {(isPending || isCountPending) && <Loader />}
                {isSuccess && (
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
                )}
            </div>

            {isCountSuccess && (
                <Pagination
                    current={currPage}
                    pageSize={pageSize}
                    total={lostCount.total}
                    hideOnSinglePage
                    showSizeChanger={false}
                    align="center"
                    onChange={paginationHandler}
                />
            )}
        </Container>
    );
};

export default Lost;
