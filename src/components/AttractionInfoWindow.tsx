import EventIcon from '@mui/icons-material/Event';
import {
    Box,
    CardMedia,
    IconButton,
    Rating,
    Tooltip,
    Typography,
} from '@mui/material';
import {InfoWindow} from '@vis.gl/react-google-maps';
import {useNavigate} from 'react-router-dom';
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
    const nav = useNavigate();

    if (attraction === null) return null;

    return (
        <InfoWindow position={centerPosition} onCloseClick={onClose}>
            <Box
                sx={{
                    position: 'relative',
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
                <Box
                    sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 1,
                    }}
                >
                    <Tooltip title='See Events'>
                        <IconButton
                            color='primary'
                            onClick={() => nav('/events/' + attraction.id)}
                            size='small'
                        >
                            <EventIcon fontSize='small' />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Typography
                    variant='h6'
                    align='center'
                    sx={{
                        color: '#393939',
                        fontWeight: 'bold',
                        mb: 1,
                        mt: 0,
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
