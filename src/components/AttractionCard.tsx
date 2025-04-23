import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Rating,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import config from '../config.json';
import {Attraction} from '../types';

interface AttractionCardProps {
    attraction: Attraction;
    userType: string;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onViewEvents: (id: number) => void;
}

const AttractionCard = ({
    attraction,
    userType,
    onEdit,
    onDelete,
    onViewEvents,
}: AttractionCardProps) => {
    return (
        <Grid item xs={12} key={attraction.id}>
            <Card
                sx={{
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    },
                }}
            >
                <CardMedia
                    component='img'
                    alt={attraction.name}
                    height='220'
                    image={`${config.GOOGLE_BUCKET_URL}/${attraction.photoPath}`}
                />
                <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                        {attraction.name}
                    </Typography>
                    {userType === 'admin' && (
                        <Typography variant='body2' color='textSecondary'>
                            Revenue: ${attraction.revenue}
                        </Typography>
                    )}
                    <Typography variant='body2' color='textSecondary'>
                        Theme: {attraction.theme}
                    </Typography>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography variant='body2' color='textSecondary'>
                            Rating:
                        </Typography>
                        <Rating
                            value={attraction.rating}
                            precision={0.1}
                            readOnly
                            size='small'
                        />
                    </Stack>
                </CardContent>
                <CardActions>
                    {userType === 'admin' && (
                        <>
                            <Tooltip title='Edit'>
                                <IconButton
                                    color='primary'
                                    onClick={() => onEdit(attraction.id)}
                                    size='small'
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Delete'>
                                <IconButton
                                    color='secondary'
                                    onClick={() => onDelete(attraction.id)}
                                    size='small'
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    <Tooltip title='See Events'>
                        <IconButton
                            color='primary'
                            onClick={() => onViewEvents(attraction.id)}
                            size='small'
                        >
                            <EventIcon />
                        </IconButton>
                    </Tooltip>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default AttractionCard;
