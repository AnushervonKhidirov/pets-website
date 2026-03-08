import type { FC, Ref } from 'react';
import type { MapMouseEvent } from '@vis.gl/react-google-maps';
import type { Marker } from '~component/common/google-map';
import type { VetClinic } from '~type/vet-clinic.type';
import type { CarouselRef } from 'antd/es/carousel';

import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMap } from '@vis.gl/react-google-maps';
import { Link } from 'react-router';
import { Typography, Carousel, Button, Space, Descriptions } from 'antd';
import { Container, Loader, ErrorInfo, GoogleMap, Empty } from '~component/common';

import vetClinicService from '~service/vet-clinic.service';
import markerVetIcon from 'src/images/map/marker-vet-icon.png';

export function meta() {
    return [{ title: 'Ветеринарные клиники' }];
}

const { Title } = Typography;
const mapZoom = 19;

const Vet = () => {
    const sliderRef = useRef<CarouselRef>(null);

    const {
        isPending,
        isError,
        isSuccess,
        error,
        data: vetClinics,
    } = useQuery({
        queryKey: ['vet-clinics'],
        queryFn: vetClinicService.getAll.bind(vetClinicService),
    });

    function markerClickHandler(e: MapMouseEvent, marker: Marker) {
        if ('index' in marker && typeof marker.index === 'number') goToSlide(marker.index);
    }

    function goToSlide(index: number) {
        if (!sliderRef) return;
        sliderRef.current?.goTo(index);
    }

    if (isPending) return <Loader />;
    if (isError) return <ErrorInfo error={error} />;

    return isSuccess && vetClinics.length > 0 ? (
        <div
            style={{
                height: '100%',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateRows: 'max-content 1fr',
            }}
        >
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
                defaultCenter={{
                    lat: vetClinics[0].latitude,
                    lng: vetClinics[0].longitude,
                }}
                onMarkerClick={markerClickHandler}
            />
        </div>
    ) : (
        <Empty description="Пока нет ветеринарных клиник" />
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
            className="carousel-black-nav"
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
        <Space vertical size="middle" style={{ padding: '1rem 2rem 2rem' }}>
            <Descriptions
                layout="vertical"
                column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
                title={
                    <Title level={4} style={{ marginBottom: 0 }}>
                        {clinic.name}
                    </Title>
                }
                items={[
                    {
                        label: (
                            <Title level={5} style={{ marginBottom: 0 }}>
                                Адрес:
                            </Title>
                        ),
                        children: <div>{clinic.address}</div>,
                    },
                    {
                        label: (
                            <Title level={5} style={{ marginBottom: 0 }}>
                                Контакты:
                            </Title>
                        ),
                        children: (
                            <Space separator={'|'}>
                                {clinic.contacts.map(contact => (
                                    <Link key={clinic.name + contact} to={'tel:' + contact}>
                                        {contact}
                                    </Link>
                                ))}
                            </Space>
                        ),
                    },
                    {
                        label: (
                            <Title level={5} style={{ marginBottom: 0 }}>
                                Описание:
                            </Title>
                        ),
                        children: <div>{clinic.about}</div>,
                    },
                ]}
            />

            <Link
                to={`https://www.google.com/maps/search/?api=1&query=${clinic.latitude},${clinic.longitude}`}
                target="_blank"
            >
                <Button color="cyan" variant="solid">
                    Открыть в приложении
                </Button>
            </Link>
        </Space>
    );
};

export default Vet;
