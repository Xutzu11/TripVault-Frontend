import {Box, CardMedia, Rating, Typography} from '@mui/material';
import {InfoWindow} from '@vis.gl/react-google-maps';
import {Attraction, MapPosition} from '../types';

interface AttractionInfoWindowProps {
    attraction: Attraction | null;
    centerPosition: MapPosition;
    onClose: () => void;
}

const AttractionInfoWindow = ({
    attraction,
    centerPosition,
    onClose,
}: AttractionInfoWindowProps) => {
    if (attraction === null) return null;

    return (
        <InfoWindow position={centerPosition} onCloseClick={onClose}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    minWidth: '250px',
                    maxWidth: '300px',
                }}
            >
                <Typography
                    variant='h6'
                    align='center'
                    sx={{
                        color: '#393939',
                        fontWeight: 'bold',
                        mb: 1,
                        mt: 0, // remove top margin to avoid too much free space
                    }}
                >
                    {attraction.name}
                </Typography>
                <Rating
                    value={attraction.rating}
                    precision={0.1}
                    size='small'
                    readOnly
                    sx={{marginBottom: 1}}
                />
                <CardMedia
                    component='img'
                    image={`${import.meta.env.VITE_GOOGLE_BUCKET_URL}/${attraction.photoPath}`}
                    alt='Attraction'
                    sx={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: 2,
                        objectFit: 'cover',
                    }}
                />
            </Box>
        </InfoWindow>
    );
};

export default AttractionInfoWindow;
