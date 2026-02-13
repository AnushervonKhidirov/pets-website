import type { WithAdditionalProps } from '~type/common.type';
import { FastColor } from '@ant-design/fast-color';

export type BackgroundProps<T = object> = WithAdditionalProps<
    { color?: string; alpha?: number; blur?: number } & T
>;

function Background<T>({
    color = '#fff',
    alpha = 1,
    blur = 0,
    children,
    ...props
}: BackgroundProps<T>) {
    const bgColor = new FastColor(color).toRgb();
    const backgroundColor = new FastColor({ ...bgColor, a: alpha }).toRgbString();

    return (
        <div
            {...props}
            style={{
                overflow: 'hidden',
                width: '100%',
                ...props.style,
                backgroundColor,
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
            }}
        >
            {children}
        </div>
    );
}

export default Background;
