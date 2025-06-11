import {Box} from '@mui/material';
import {AdvancedMarker, APIProvider, Map, Pin} from '@vis.gl/react-google-maps';
import {MapPosition} from '../types';

const containerStyle = {
    width: '100%',
    height: '300px',
};

const defaultCenter = {
    lat: 45.9432,
    lng: 24.9668,
};

const MapSelector = ({
    position,
    setPosition,
}: {
    position: MapPosition | null;
    setPosition: (pos: MapPosition) => void;
}) => {
    return (
        <Box sx={{mt: 2}}>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map
                    mapId={import.meta.env.VITE_MAP_ID}
                    style={containerStyle}
                    defaultCenter={position || defaultCenter}
                    defaultZoom={6}
                    disableDefaultUI
                    onClick={(e) => {
                        if (e.detail.latLng) {
                            setPosition({
                                lat: e.detail.latLng.lat,
                                lng: e.detail.latLng.lng,
                            });
                        }
                    }}
                >
                    {position && (
                        <AdvancedMarker position={position}>
                            <Pin
                                background={'#ad9267'}
                                borderColor={'black'}
                                glyphColor={'white'}
                            />
                        </AdvancedMarker>
                    )}
                </Map>
            </APIProvider>
        </Box>
    );
};

export default MapSelector;
