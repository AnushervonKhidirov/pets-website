import type { FC, Ref } from 'react';
import type { MapMouseEvent } from '@vis.gl/react-google-maps';
import type { Marker } from '~component/common/google-map';
import type { VetClinic } from '~type/vet-clinic.type';
import type { CarouselRef } from 'antd/es/carousel';

import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMap } from '@vis.gl/react-google-maps';
import { Link } from 'react-router';
import { Typography, Carousel, Button, Space } from 'antd';
import { Container, Loader, ErrorInfo, GoogleMap } from '~component/common';

import classes from './vet-clinic.module.css';
import vetClinicService from '~service/vet-clinic.service';
import markerVetIcon from 'src/images/map/marker-vet-icon.png';

export function meta() {
    return [{ title: 'Ветеринарные клиники' }];
}

const { Title } = Typography;
const mapZoom = 19;

const Vet = () => {
    const sliderRef = useRef<CarouselRef>(null);
    const [curClinic, setCurClinic] = useState<VetClinic>();

    const {
        isPending,
        isError,
        isSuccess,
        error,
        data: vetClinics,
    } = useQuery({
        queryKey: ['vet-clinics'],
        queryFn: fetchClinics,
    });

    function markerClickHandler(e: MapMouseEvent, marker: Marker) {
        if ('index' in marker && typeof marker.index === 'number') goToSlide(marker.index);
    }

    function goToSlide(index: number) {
        if (!sliderRef) return;
        sliderRef.current?.goTo(index);
    }

    async function fetchClinics() {
        const [clinics, err] = await vetClinicService.getAll();
        if (err) throw err;
        setCurClinic(clinics[0]);
        return clinics;
    }

    if (isPending) return <Loader />;
    if (isError) return <ErrorInfo error={error} />;

    return (
        isSuccess &&
        curClinic && (
            <div className={classes.page}>
                <Container>
                    <VetCarousel ref={sliderRef} vetClinics={vetClinics} />
                </Container>

                <GoogleMap
                    markers={vetClinics.map((clinic, index) => ({
                        lat: clinic.latitude,
                        lng: clinic.longitude,
                        index,
                        ...clinic,
                    }))}
                    markerIcon={markerVetIcon}
                    defaultZoom={mapZoom}
                    defaultCenter={{ lat: curClinic.latitude, lng: curClinic.longitude }}
                    onMarkerClick={markerClickHandler}
                />
            </div>
        )
    );
};

const VetCarousel: FC<{
    ref: Ref<CarouselRef>;
    vetClinics: VetClinic[];
}> = ({ ref, vetClinics }) => {
    const map = useMap();

    function sliderHandler(currentSlide: number, nextSlide: number) {
        const vetClinic = vetClinics[nextSlide];

        if (map && vetClinic) {
            map.panTo({ lat: vetClinic.latitude, lng: vetClinic.longitude });
            map.setZoom(mapZoom);
        }
    }

    return (
        <Carousel
            ref={ref}
            arrows
            draggable
            className={classes.carousel}
            beforeChange={sliderHandler}
            style={{ width: '100%' }}
        >
            {vetClinics.map(clinic => (
                <VetSlide key={'clinic_slide-' + clinic.id} clinic={clinic} />
            ))}
        </Carousel>
    );
};

const VetSlide: FC<{ clinic: VetClinic }> = ({ clinic }) => {
    return (
        <div className={classes.vet_slide}>
            <Title level={4} className={classes.name}>
                {clinic.name}
            </Title>

            <div className={classes.address}>
                <Title level={5}>Адрес:</Title>

                <div style={{ lineHeight: 1 }}>{clinic.address}</div>
            </div>

            {clinic.about && (
                <div className={classes.desc}>
                    <Title level={5}>Описание:</Title>

                    <div style={{ lineHeight: 1 }}>{clinic.about}</div>
                </div>
            )}

            <div className={classes.contacts}>
                <Title level={5}>Контакты:</Title>

                <Space separator={'|'}>
                    {clinic.contacts.map(contact => (
                        <Link key={clinic.name + contact} to={'tel:' + contact}>
                            {contact}
                        </Link>
                    ))}
                </Space>
            </div>

            <Link
                to={`https://www.google.com/maps/search/?api=1&query=${clinic.latitude},${clinic.longitude}`}
                target="_blank"
                style={{ width: 'max-content' }}
            >
                <Button color="cyan" variant="solid">
                    Открыть в приложении
                </Button>
            </Link>
        </div>
    );
};

export default Vet;
