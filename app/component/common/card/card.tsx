import type { FC } from 'react';
import type { CardProps as AntCardProps } from 'antd';

import { Card as AndCard } from 'antd';

import classNames from 'classnames';
import classes from './card.module.css';

type CardProps = AntCardProps & { colored?: boolean };

const Card: FC<CardProps> = ({ colored = false, ...props }) => {
    return (
        <AndCard
            variant="borderless"
            {...props}
            className={classNames(classes.card, { [classes.colored]: colored }, props.className)}
        >
            {props.children}
        </AndCard>
    );
};

export default Card;
