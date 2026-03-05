import type { FC, HTMLProps } from 'react';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';

type ImageProps = Omit<HTMLProps<HTMLImageElement>, 'src'> & {
    src?: string | URL;
};

const Image: FC<ImageProps> = ({ src, alt, ...props }) => {
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
    }, [imgRef, imageLoaded]);

    useLayoutEffect(() => {
        imageViewHandler(imgRef.current);
    }, [imgRef.current]);

    return <img ref={imgRef} data-src={source} alt={alt} {...props} />;
};

export default Image;
