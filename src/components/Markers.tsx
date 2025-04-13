import {Marker, MarkerClusterer} from '@googlemaps/markerclusterer';
import {AdvancedMarker, Pin, useMap} from '@vis.gl/react-google-maps';
import {useEffect, useRef, useState} from 'react';
import {Attraction} from '../types';

const createCustomRenderer = () => {
    return {
        render({
            count,
            position,
        }: {
            count: number;
            position: google.maps.LatLngLiteral;
        }) {
            const svg = window.btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                    <rect x="5" y="15" width="30" height="20" fill="white" stroke="black" stroke-width="1"/>
                    <polygon points="5,15 20,5 35,15" fill="#ad9267" stroke="black" stroke-width="1"/>
                    <text x="50%" y="65%" text-anchor="iddle" fill="#ad9267" font-size="20" font-family="Roboto" dy=".3em">${count}</text>
                </svg>
            `);

            const markerIcon = {
                url: `data:image/svg+xml;base64,${svg}`,
                scaledSize: new window.google.maps.Size(40, 40),
            };
            return new window.google.maps.Marker({
                position,
                icon: markerIcon,
            });
        },
    };
};

const Markers = ({
    attractions,
    setOpen,
    setPhoto,
    setCenterPosition,
}: {
    attractions: Attraction[];
    setOpen: (open: string) => void;
    setPhoto: (photo: string) => void;
    setCenterPosition: (centerPosition: {lat: number; lng: number}) => void;
}) => {
    const [markers, setMarkers] = useState<{[id: number]: Marker}>({});
    const map = useMap();
    const clusterer = useRef<MarkerClusterer | null>(null);

    useEffect(() => {
        if (map && !clusterer.current) {
            clusterer.current = new MarkerClusterer({map});
            clusterer.current.setValues({renderer: createCustomRenderer()});
        }
    }, [map]);

    useEffect(() => {
        if (clusterer.current) {
            clusterer.current.clearMarkers();
            clusterer.current.addMarkers(Object.values(markers));
        }
    }, [markers]);

    const setMarkerRef = (marker: Marker | null, id: number) => {
        if ((marker && markers[id]) || (!marker && !markers[id])) return;
        setMarkers((prev) => {
            if (marker) {
                return {...prev, [id]: marker};
            } else {
                const {[id]: _, ...newMarkers} = prev;
                return newMarkers;
            }
        });
    };

    return (
        <>
            {attractions.map((attraction) => (
                <AdvancedMarker
                    ref={(marker) => setMarkerRef(marker, attraction.id)}
                    key={attraction.id}
                    position={{
                        lat: attraction.latitude,
                        lng: attraction.longitude,
                    }}
                    onClick={() => {
                        setOpen(attraction.name);
                        setPhoto(attraction.photoPath);
                        setCenterPosition({
                            lat: attraction.latitude,
                            lng: attraction.longitude,
                        });
                    }}
                >
                    <Pin
                        background={'white'}
                        borderColor={'black'}
                        glyphColor={'#ad9267'}
                    />
                </AdvancedMarker>
            ))}
        </>
    );
};

export default Markers;
