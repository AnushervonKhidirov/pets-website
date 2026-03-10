import type { FC, HTMLProps } from 'react';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';

type ImageProps = Omit<HTMLProps<HTMLImageElement>, 'src'> & {
    src?: string | URL;
    cover?: boolean;
    center?: boolean;
};

const Image: FC<ImageProps> = ({ src, alt, cover, center = true, ...props }) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const source = src instanceof URL ? src.href : src;
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
            data-src={source}
            alt={alt}
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
