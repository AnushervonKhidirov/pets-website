import type { FC } from 'react';
import type { ButtonProps } from 'antd/lib';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Scanner as YudielScanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';

import { Button, Popover, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Container from '../container';

import { isMobile, isTablet } from 'mobile-device-detect';
import classes from './scanner.module.css';

const { Title, Paragraph } = Typography;

type ScannerProps = {
    onScan?: (code: string) => void;
    onError?: (error: unknown) => void;
};

type ScannerAdditionalProps = {
    buttonProps?: ButtonProps;
    onMobileOnly?: boolean;
    hint?: boolean;
    hintText?: string;
};

const Scanner: FC<ScannerProps & ScannerAdditionalProps> = ({
    onScan,
    onError,
    buttonProps,
    onMobileOnly,
    hint,
    hintText,
}) => {
    const [open, setOpen] = useState(false);
    const [hintOpen, setHintOpen] = useState(false);

    function openScanner() {
        setOpen(true);
        document.body.style.overflow = 'hidden';
    }

    function closeScanner() {
        setOpen(false);
        document.body.style.overflow = 'auto';
    }

    useEffect(() => {
        if (hint) {
            setTimeout(() => {
                setHintOpen(true);
            }, 500);

            setTimeout(() => {
                setHintOpen(false);
            }, 3000);
        }
    }, [hint]);

    useEffect(() => {
        return () => {
            closeScanner();
        };
    }, []);

    return (
        (isMobile || isTablet) &&
        onMobileOnly && (
            <>
                <Popover
                    open={hintOpen}
                    content={hintText ?? 'Нажмите чтоб отсканировать код'}
                    styles={{ content: { fontSize: '0.75em' } }}
                    placement="topRight"
                >
                    <Button onClick={openScanner} {...buttonProps}>
                        {buttonProps?.children}
                    </Button>
                </Popover>

                {open &&
                    createPortal(
                        <ScannerModal onScan={onScan} onError={onError} close={closeScanner} />,
                        document.body,
                    )}
            </>
        )
    );
};

const ScannerModal: FC<ScannerProps & { close: () => void }> = ({ onScan, onError, close }) => {
    function scan(codes: IDetectedBarcode[]) {
        if (onScan) onScan(codes[0].rawValue);
        close();
    }

    return (
        <Container section className={classes.container} innerClassName={classes.container_inner}>
            <div style={{ maxWidth: 400, aspectRatio: ' 1/ 0.4', padding: '0.5rem' }}>
                <YudielScanner
                    onScan={scan}
                    onError={onError}
                    classNames={{ container: classes.scan_container }}
                >
                    <div className={classes.square}></div>
                </YudielScanner>
            </div>

            <div style={{ maxWidth: 400 }}>
                <div className={classes.headline}>
                    <Title level={3} style={{ marginBottom: 0 }}>
                        Сканер штрих кода
                    </Title>

                    <Button color="cyan" variant="solid" icon={<CloseOutlined />} onClick={close} />
                </div>

                <Paragraph>
                    Наведите камеру на штрихкод чипа предоставленный клиникой после чипирования
                    питомца
                </Paragraph>

                <Paragraph>Она так же должна быть наклеена на паспорте питомца</Paragraph>
            </div>
        </Container>
    );
};

export default Scanner;
