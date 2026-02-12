import type { FC } from 'react';
import type { MapProps } from '@vis.gl/react-google-maps';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API;

// NOTE: center of Dushanbe
const defaultPosition: Coordinate = {
    lat: 38.58298869460847,
    lng: 68.78661795974861,
};

type GoogleMapProps = MapProps & { markers?: Coordinate[]; defaultCenter?: Coordinate };
export type Coordinate = Record<'lat' | 'lng', number>;

const GoogleMap: FC<GoogleMapProps> = ({ markers = [], ...props }) => {
    return (
        <APIProvider apiKey={API_KEY} language="ru">
            <Map
                defaultCenter={defaultPosition}
                defaultZoom={13}
                gestureHandling="greedy"
                disableDefaultUI
                {...props}
                style={{ width: '100%', height: '100%', overflow: 'hidden', ...props.style }}
            >
                {markers.map(({ lat, lng }) => (
                    <Marker key={`${lat}-${lng}`} position={{ lat, lng }} />
                ))}
            </Map>
        </APIProvider>
    );
};

export default GoogleMap;
