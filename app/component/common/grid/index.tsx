import type { FC } from 'react';
import type { WithAdditionalProps } from '~type/common.type';

import classNames from 'classnames';
import classes from './grid.module.css';

type GridProps = WithAdditionalProps<{
    size?: 'small' | 'medium' | 'large' | 'full-line';
}>;

const Grid: FC<GridProps> = ({ size = 'medium', className, children }) => {
    return <div className={classNames(classes.grid, classes[size], className)}>{children}</div>;
};

export default Grid;
