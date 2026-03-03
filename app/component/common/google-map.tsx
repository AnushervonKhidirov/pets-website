import type { FC } from 'react';
import type { MapProps, MapMouseEvent } from '@vis.gl/react-google-maps';

import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';

const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_ID;

// NOTE: center of Dushanbe
const defaultPosition: Marker = {
    lat: 38.58298869460847,
    lng: 68.78661795974861,
};

type GoogleMapProps = MapProps & {
    markers?: Marker[];
    defaultCenter?: Marker;
    onMarkerClick?: (e: MapMouseEvent, marker: Marker) => void;
};

export type Marker = Record<string, unknown> & {
    lat: number;
    lng: number;
};

const GoogleMap: FC<GoogleMapProps> = ({ markers = [], onMarkerClick, ...props }) => {
    return (
        <Map
            gestureHandling="greedy"
            mapId={MAP_ID}
            {...props}
            defaultCenter={props.defaultCenter ?? defaultPosition}
            defaultZoom={props.defaultZoom ?? 13}
            style={{ width: '100%', height: '100%', overflow: 'hidden', ...props.style }}
        >
            {markers.map(marker => (
                <AdvancedMarker
                    key={`${marker.lat}-${marker.lng}`}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    onClick={e => {
                        if (onMarkerClick) onMarkerClick(e, marker);
                    }}
                />
            ))}
        </Map>
    );
};

export default GoogleMap;
