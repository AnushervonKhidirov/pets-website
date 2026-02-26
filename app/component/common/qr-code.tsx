import type { FC } from 'react';
import type { QRCodeProps } from 'antd';

import { useState } from 'react';

import { QRCode as AntQR } from 'antd';
import Background from './background';

import logo_100 from 'src/images/logo/logo-100x100.png';

function doDownload(url: string, fileName: string) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

const downloadCanvasQRCode = (name: string = 'QRCode') => {
    const canvas = document.getElementById('qr-code')?.querySelector<HTMLCanvasElement>('canvas');

    if (!canvas) return;
    const url = canvas.toDataURL();
    doDownload(url, `${name}.png`);
};

const downloadSvgQRCode = (name: string = 'QRCode') => {
    const svg = document.getElementById('qr-code')?.querySelector<SVGElement>('svg');
    const svgData = new XMLSerializer().serializeToString(svg!);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    doDownload(url, `${name}.png`);
};

const QRCode: FC<QRCodeProps & { name?: string }> = ({
    type = 'canvas',
    size = 300,
    name,
    ...props
}) => {
    const [showMessage, setShowMessage] = useState(false);

    function download() {
        type === 'canvas' ? downloadCanvasQRCode(name) : downloadSvgQRCode(name);
    }

    function showTip() {
        setShowMessage(true);

        setTimeout(() => setShowMessage(false), 3000);
    }

    return (
        <button
            style={{ position: 'relative', width: 'max-content', cursor: 'pointer' }}
            onDoubleClick={download}
            onClick={showTip}
        >
            <AntQR
                id="qr-code"
                type={type}
                marginSize={1}
                icon={logo_100}
                iconSize={size / 4}
                size={size}
                color="#000"
                bgColor="#fff"
                {...props}
                style={{ padding: 0, ...props.style }}
            />

            <Background
                color="#000"
                alpha={0.8}
                style={{
                    position: 'absolute',
                    inset: 0,
                    color: '#fff',
                    borderRadius: 'var(--border-radius-lg)',
                    pointerEvents: 'none',
                    transition: 'opacity 0.3s',
                    display: 'grid',
                    alignItems: 'center',
                    justifyItems: 'center',
                    fontSize: '1.5rem',
                    opacity: Number(showMessage),
                }}
            >
                Нажмите 2 раза
                <br /> чтобы скачать
            </Background>
        </button>
    );
};

export default QRCode;
