import {
    DirectionsCar,
    DirectionsTransit,
    DirectionsWalk,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Slider,
    TextField,
    Typography,
} from '@mui/material';

interface MapFiltersPanelProps {
    minRating: number;
    setMinRating: (value: number) => void;
    maxAttractions: number;
    setMaxAttractions: (value: number) => void;
    maxDistance: number;
    setMaxDistance: (value: number) => void;
    onSearchRoute: () => void;
    onResetFilters: () => void;
    transportMode: google.maps.TravelMode;
    setTransportMode: (mode: google.maps.TravelMode) => void;
}

const MapFiltersPanel = ({
    minRating,
    setMinRating,
    maxAttractions,
    setMaxAttractions,
    maxDistance,
    setMaxDistance,
    onSearchRoute,
    onResetFilters,
    transportMode,
    setTransportMode,
}: MapFiltersPanelProps) => {
    return (
        <Box
            sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                width: 300,
                zIndex: 10,
            }}
        >
            <Card>
                <CardContent>
                    <Typography variant='h6'>Filters</Typography>
                    <Typography sx={{marginTop: 2}} variant='subtitle2'>
                        Minimum Rating
                    </Typography>
                    <Slider
                        value={minRating}
                        onChange={(_, value) => setMinRating(value as number)}
                        min={0}
                        max={5}
                        step={0.1}
                        valueLabelDisplay='auto'
                    />
                    <Typography sx={{marginTop: 1}} variant='subtitle2'>
                        Maximum Attractions
                    </Typography>
                    <TextField
                        type='number'
                        value={maxAttractions}
                        onChange={(e) =>
                            setMaxAttractions(
                                Math.min(
                                    Math.max(parseInt(e.target.value), 1),
                                    9,
                                ),
                            )
                        }
                        inputProps={{min: 1, max: 9}}
                        fullWidth
                    />
                    <Typography sx={{marginTop: 1}} variant='subtitle2'>
                        Maximum Distance (km)
                    </Typography>
                    <Slider
                        value={maxDistance}
                        onChange={(_, value) => setMaxDistance(value as number)}
                        min={0}
                        max={20}
                        step={0.5}
                        valueLabelDisplay='auto'
                    />
                    <Typography variant='subtitle2' sx={{marginBottom: 1}}>
                        Transport Mode
                    </Typography>
                    <Box sx={{display: 'flex', gap: 2, marginBottom: 2}}>
                        <DirectionsWalk
                            sx={{
                                color:
                                    transportMode ===
                                    google.maps.TravelMode.WALKING
                                        ? '#ad9267'
                                        : 'white',
                                cursor: 'pointer',
                            }}
                            onClick={() =>
                                setTransportMode(google.maps.TravelMode.WALKING)
                            }
                        />
                        <DirectionsTransit
                            sx={{
                                color:
                                    transportMode ===
                                    google.maps.TravelMode.TRANSIT
                                        ? '#ad9267'
                                        : 'white',
                                cursor: 'pointer',
                            }}
                            onClick={() =>
                                setTransportMode(google.maps.TravelMode.TRANSIT)
                            }
                        />
                        <DirectionsCar
                            sx={{
                                color:
                                    transportMode ===
                                    google.maps.TravelMode.DRIVING
                                        ? '#ad9267'
                                        : 'white',
                                cursor: 'pointer',
                            }}
                            onClick={() =>
                                setTransportMode(google.maps.TravelMode.DRIVING)
                            }
                        />
                    </Box>
                    <Button
                        sx={{marginTop: 1, marginRight: 3}}
                        variant='contained'
                        onClick={onSearchRoute}
                    >
                        Search route
                    </Button>
                    <Button
                        sx={{marginTop: 1}}
                        variant='contained'
                        onClick={onResetFilters}
                    >
                        Reset filters
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default MapFiltersPanel;
