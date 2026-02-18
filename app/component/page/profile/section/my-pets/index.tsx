import type { FC, RefObject } from 'react';
import type { Pet } from '~type/pet.type';

import { useEffect, useRef, useState } from 'react';
import { useEffectOnce } from '~hook/use-effect-once';
import petService from '~service/pet.service';
import useMyPetsStore from '~store/my-pets.store';

import { Empty, Button, Typography, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Container, Grid, PetCard } from '~component/common';
import { alertError } from '~helper/alert-error';
import PetModal from '~pageComponent/profile/pet-modal';

import blackCat from 'src/images/black-cat.png';
import blackCatHand from 'src/images/black-cat-hand.png';

import classes from './my-pets.module.css';

const { Title } = Typography;

const MyPets: FC = () => {
    const { pets, setPets } = useMyPetsStore(state => state);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [api, context] = notification.useNotification();

    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    async function fetchMyPets() {
        const [myPets, err] = await petService.getMy();

        if (err) {
            api.error(alertError(err));
        } else {
            setPets(myPets);
        }
    }

    useEffectOnce(() => {
        fetchMyPets();
    });

    return (
        <Container section>
            <div className={classes.header}>
                <Title level={3}>
                    <span className={classes.headline}>Ваши питомцы</span>
                </Title>

                <Button
                    color="cyan"
                    variant="solid"
                    ref={buttonRef}
                    onClick={() => {
                        setSelectedPet(null);
                        setModalOpen(true);
                    }}
                >
                    <PlusOutlined style={{ fontSize: '1.25em' }} />
                </Button>
            </div>

            {Array.isArray(pets) && pets.length > 0 ? (
                <Grid>
                    {pets.map(pet => (
                        <PetCard key={pet.id} pet={pet} />
                    ))}
                </Grid>
            ) : (
                <Empty
                    image={<Cat buttonRef={buttonRef} />}
                    styles={{ image: { height: '15rem' } }}
                    description={
                        <span>
                            У вас пока нет питомцев.
                            <br /> Котик укажет кнопку!
                        </span>
                    }
                />
            )}
            {context}

            <PetModal
                pet={selectedPet}
                setPet={setSelectedPet}
                open={modalOpen}
                setOpen={setModalOpen}
            />
        </Container>
    );
};

const Cat: FC<{ buttonRef: RefObject<HTMLButtonElement | null> }> = ({ buttonRef }) => {
    const handRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const setAngleBind = setAngle.bind(null, handRef, buttonRef);

        setAngleBind();
        globalThis.addEventListener('resize', setAngleBind);

        return () => {
            globalThis.removeEventListener('resize', setAngleBind);
        };
    }, [handRef.current, buttonRef.current]);

    function setAngle(
        handRef: RefObject<HTMLImageElement | null>,
        buttonRef: RefObject<HTMLButtonElement | null>,
    ) {
        if (handRef.current && buttonRef.current) {
            const handPosition = {
                x: handRef.current.getBoundingClientRect().x,
                y:
                    handRef.current.getBoundingClientRect().y +
                    handRef.current.getBoundingClientRect().height / 2,
            };

            const buttonPosition = {
                x:
                    buttonRef.current.getBoundingClientRect().x +
                    buttonRef.current.getBoundingClientRect().width / 2 -
                    handPosition.x,
                y:
                    buttonRef.current.getBoundingClientRect().y +
                    buttonRef.current.getBoundingClientRect().height / 2 -
                    handPosition.y,
            };

            const radian = Math.atan2(buttonPosition.y, buttonPosition.x);
            const degree = (radian * 180) / Math.PI;
            handRef.current.style.transform = `rotate(${degree}deg)`;
        }
    }

    return (
        <div className={classes.empty_img}>
            <img className={classes.cat} src={blackCat} alt="Cat" />
            <img className={classes.cat_hand} ref={handRef} src={blackCatHand} alt="Cat's hand" />
        </div>
    );
};

export default MyPets;
