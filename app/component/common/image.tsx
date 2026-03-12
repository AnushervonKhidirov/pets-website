import type { FC, HTMLProps } from 'react';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';

import classNames from 'classnames';

type ImageProps = Omit<HTMLProps<HTMLImageElement>, 'src' | 'placeholder'> & {
    src?: string | URL | null;
    placeholder?: string | URL | null;
    placeholderClassName?: string;
    cover?: boolean;
    center?: boolean;
};

const Image: FC<ImageProps> = ({
    src,
    placeholder,
    placeholderClassName,
    alt,
    cover,
    center = true,
    ...props
}) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const source = src instanceof URL ? src.href : src;
    const placeholderSource = placeholder instanceof URL ? placeholder.href : placeholder;
    const [imageLoaded, setImageLoaded] = useState(false);

    function imageViewHandler(img: HTMLImageElement | null) {
        if (!img?.dataset.src) return;
        const imgData = img.getBoundingClientRect();

        if (imgData.top < globalThis.innerHeight + 100) {
            img.src = img.dataset.src;
            setImageLoaded(true);
        }
    }

    useEffect(() => {
        const imageViewHandlerBind = imageViewHandler.bind(null, imgRef.current);

        const event = imageLoaded ? 'removeEventListener' : 'addEventListener';
        document[event]('scroll', imageViewHandlerBind);

        return () => {
            document.removeEventListener('scroll', imageViewHandlerBind);
        };
    }, [imgRef, imageLoaded, src]);

    useLayoutEffect(() => {
        imageViewHandler(imgRef.current);
    }, [imgRef.current, src]);

    return (
        <img
            ref={imgRef}
            data-src={source ?? placeholderSource}
            alt={alt}
            className={classNames(props.className, {
                [placeholderClassName ?? 'image-placeholder']: !source,
            })}
            {...props}
            style={{
                width: '100%',
                height: '100%',
                objectFit: cover ? 'cover' : 'contain',
                objectPosition: center ? 'center' : undefined,
                ...props.style,
            }}
        />
    );
};

export default Image;
