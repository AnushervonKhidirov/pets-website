import type { FC } from 'react';
import type { CardProps as AntCardProps } from 'antd';
import type { BackgroundProps } from './background';

import { Card as AntCard } from 'antd';
import Background from './background';

type CardProps = BackgroundProps<AntCardProps & { innerClassName?: string }>;

const Card: FC<CardProps> = ({ color = '#fff', alpha = 1, blur = 0, innerClassName, ...props }) => {
    return (
        <AntCard
            variant="borderless"
            {...props}
            styles={{
                body: { padding: 0, overflow: 'hidden' },
                root: { backgroundColor: 'transparent' },
            }}
        >
            <Background
                color={color}
                alpha={alpha}
                blur={blur}
                style={{ padding: 'var(--card-body-padding)' }}
                className={innerClassName}
            >
                {props.children}
            </Background>
        </AntCard>
    );
};

export default Card;
