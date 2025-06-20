import {ChevronLeft, ChevronRight} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Typography,
} from '@mui/material';
import {useState} from 'react';
import {AttractionWithPrice} from '../types';

interface RouteInfoCardProps {
    directions: google.maps.DirectionsResult | null;
    selectedRoute: google.maps.DirectionsRoute;
    legIndex: number;
    closeAttractions: AttractionWithPrice[];
    onNextLeg: () => void;
}

const RouteInfoCard = ({
    directions,
    selectedRoute,
    legIndex,
    closeAttractions,
    onNextLeg,
}: RouteInfoCardProps) => {
    const [open, setOpen] = useState(true);

    const formatDistance = (distance: number) => {
        return distance < 1000
            ? `${distance} meters`
            : `${(distance / 1000).toFixed(2)} km`;
    };

    const formatDuration = (duration: number) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        return hours > 0 ? `${hours} hrs ${minutes} mins` : `${minutes} mins`;
    };

    const totalDistance = selectedRoute?.legs?.reduce(
        (acc, leg) => acc + (leg.distance?.value || 0),
        0,
    );

    const totalDuration = selectedRoute?.legs?.reduce(
        (acc, leg) => acc + (leg.duration?.value || 0),
        0,
    );

    const totalPrice = closeAttractions.reduce(
        (acc, attraction) => acc + (attraction.price || 0),
        0,
    );

    const getAttractionName = (index: number) => {
        const waypointIndex = selectedRoute?.waypoint_order?.[index];
        return waypointIndex !== undefined && closeAttractions[waypointIndex]
            ? closeAttractions[waypointIndex].name
            : 'Unknown';
    };

    const getAttractionPrice = (index: number) => {
        const waypointIndex = selectedRoute?.waypoint_order?.[index];
        return waypointIndex !== undefined && closeAttractions[waypointIndex]
            ? closeAttractions[waypointIndex].price > 0
                ? closeAttractions[waypointIndex].price + '$'
                : 'Free'
            : 'Unknown';
    };

    return (
        <>
            {/* Toggle Button */}
            {!open && (
                <IconButton
                    onClick={() => setOpen(true)}
                    sx={{
                        position: 'absolute',
                        top: 80,
                        right: 0,
                        zIndex: 20,
                        backgroundColor: '#ad9267',
                        color: 'white',
                        borderRadius: '4px 0 0 4px',
                        '&:hover': {backgroundColor: '#c0a375'},
                    }}
                >
                    <ChevronLeft />
                </IconButton>
            )}

            {/* Info Panel */}
            {open && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        width: {xs: '85vw', sm: 300},
                        maxWidth: 360,
                        zIndex: 10,
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    <Card>
                        <CardContent>
                            <Box
                                display='flex'
                                justifyContent='space-between'
                                alignItems='center'
                            >
                                <Typography variant='subtitle1'>
                                    Route Info
                                </Typography>
                                <IconButton
                                    onClick={() => setOpen(false)}
                                    size='small'
                                    sx={{color: 'gray'}}
                                >
                                    <ChevronRight />
                                </IconButton>
                            </Box>

                            {directions && closeAttractions.length > 0 ? (
                                <>
                                    <Typography
                                        variant='subtitle2'
                                        color='textSecondary'
                                    >
                                        Total distance:{' '}
                                        {formatDistance(totalDistance || 0)}
                                    </Typography>
                                    <Typography
                                        variant='subtitle2'
                                        color='textSecondary'
                                    >
                                        Total duration:{' '}
                                        {formatDuration(totalDuration || 0)}
                                    </Typography>
                                    <Typography
                                        variant='subtitle2'
                                        color='textSecondary'
                                    >
                                        Total price:{' '}
                                        {totalPrice > 0
                                            ? `${totalPrice}$`
                                            : 'Free'}
                                    </Typography>
                                    <Typography
                                        sx={{marginTop: 1}}
                                        variant='subtitle1'
                                    >
                                        {legIndex <
                                        selectedRoute.legs.length - 1
                                            ? `Attraction ${legIndex + 1}/${selectedRoute.legs.length - 1}`
                                            : 'Back to Home'}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        color='textPrimary'
                                    >
                                        From:{' '}
                                        {legIndex === 0
                                            ? 'Home'
                                            : getAttractionName(legIndex - 1)}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        color='textPrimary'
                                    >
                                        To:{' '}
                                        {legIndex >=
                                        selectedRoute.legs.length - 1
                                            ? 'Home'
                                            : getAttractionName(legIndex)}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        color='textPrimary'
                                    >
                                        Distance:{' '}
                                        {selectedRoute.legs?.[legIndex]
                                            ?.distance?.text || 'N/A'}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        color='textPrimary'
                                    >
                                        Duration:{' '}
                                        {selectedRoute.legs?.[legIndex]
                                            ?.duration?.text || 'N/A'}
                                    </Typography>
                                    {legIndex <
                                        selectedRoute.legs.length - 1 && (
                                        <Typography
                                            variant='body2'
                                            color='textPrimary'
                                        >
                                            Price:{' '}
                                            {getAttractionPrice(legIndex)}
                                        </Typography>
                                    )}
                                    <Button
                                        sx={{marginTop: 1}}
                                        onClick={onNextLeg}
                                    >
                                        Next Attraction
                                    </Button>
                                </>
                            ) : (
                                <Typography variant='body2' color='textPrimary'>
                                    No route available.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            )}
        </>
    );
};

export default RouteInfoCard;
