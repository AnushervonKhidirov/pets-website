import type { FC } from 'react';
import type { QRCodeProps } from 'antd';

import { Button, Space, QRCode as AntQR } from 'antd';

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

const QRCode: FC<QRCodeProps & { name?: string }> = ({ type = 'canvas', name, ...props }) => {
    return (
        <Space vertical>
            <AntQR
                id="qr-code"
                type={type}
                marginSize={1}
                size={250}
                color="#000"
                bgColor="#fff"
                {...props}
                style={{ padding: 0, ...props.style }}
            />

            <Button
                block
                color="default"
                variant="solid"
                onClick={
                    type === 'canvas'
                        ? downloadCanvasQRCode.bind(null, name)
                        : downloadSvgQRCode.bind(null, name)
                }
            >
                Download
            </Button>
        </Space>
    );
};

export default QRCode;
