import type { FC, CSSProperties } from 'react';
import type { WithAdditionalProps } from '~type/common.type';

import classNames from 'classnames';
import classes from './grid.module.css';

type GridProps = WithAdditionalProps<{
    size?: 'small' | 'medium' | 'large' | 'full-line';
    style?: CSSProperties;
}>;

const Grid: FC<GridProps> = ({ size = 'medium', className, children, style }) => {
    return (
        <div className={classNames(classes.grid, classes[size], className)} style={style}>
            {children}
        </div>
    );
};

export default Grid;
