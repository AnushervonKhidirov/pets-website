import type { CSSProperties, FC } from 'react';
import type { CardProps as AntCardProps } from 'antd';
import type { BackgroundProps } from '../background';

import { Card as AntCard } from 'antd';
import Background from '../background';

import classNames from 'classnames';
import classes from './card.module.css';

type CardProps = BackgroundProps<
    AntCardProps & { innerClassName?: string; contentStyles?: CSSProperties }
>;

const Card: FC<CardProps> = ({
    color = '#fff',
    alpha = 1,
    blur = 0,
    innerClassName,
    contentStyles,
    ...props
}) => {
    const size = props.size ?? 'default';

    return (
        <AntCard
            variant="borderless"
            {...props}
            styles={{
                body: { padding: 0, overflow: 'hidden' },
                root: { overflow: 'hidden' },
            }}
            className={classes.card_wrapper}
        >
            {props.children ? (
                <Background
                    color={color}
                    alpha={alpha}
                    blur={blur}
                    style={contentStyles}
                    className={classNames(
                        classes.card_content,
                        classes[size + '_size'],
                        innerClassName,
                    )}
                >
                    {props.children}
                </Background>
            ) : null}
        </AntCard>
    );
};

export default Card;
