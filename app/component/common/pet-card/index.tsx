import type { FC } from 'react';
import type { Pet } from '~type/pet.type';

import { Link } from 'react-router';
import { Tag } from 'antd';
import { TickIcon, WarningIcon } from '~icons';
import { Card, Background } from '~component/common';

import { gray, light } from '~/config/ant.config';
import { Route } from '~constant/route';

import classes from './pet-card.module.css';
import classNames from 'classnames';
import placeholder from 'src/images/pet-placeholder.png';

const PetCard: FC<{ pet: Pet }> = ({ pet }) => {
    return (
        <Link to={`${Route.PetInfo}/${pet.id}`}>
            <Card
                color={light}
                hoverable
                cover={<CardImage pet={pet} />}
                contentStyles={{ display: 'none' }}
                style={{ borderRadius: '1rem' }}
            />
        </Link>
    );
};

const CardImage: FC<{ pet: Pet }> = ({ pet }) => {
    return (
        <Background
            className={classes.header}
            color={gray[2]}
            style={{ aspectRatio: '1/0.5', display: 'grid' }}
        >
            <img
                src={pet.image ?? placeholder}
                alt={pet.name}
                className={classNames(classes.image, { [classes.placeholder]: !pet.image })}
            />

            <div className={classes.header_overlay}>
                <div className={classes.name}>{pet.name}</div>
                {pet.breed?.ru && <div className={classes.breed}>{pet.breed.ru}</div>}
                <StatusTag lost={pet.lost} />
            </div>
        </Background>
    );
};

const StatusTag: FC<{ lost: boolean }> = ({ lost }) => {
    return lost ? (
        <Tag
            color="error"
            variant="solid"
            icon={<WarningIcon />}
            className={classNames(classes.tag, { [classes.lost]: lost })}
        >
            Потерян
        </Tag>
    ) : (
        <Tag color="success" variant="outlined" icon={<TickIcon />} className={classes.tag}>
            Дома
        </Tag>
    );
};

export default PetCard;
