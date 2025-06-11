import {Send} from '@mui/icons-material';
import {Box, IconButton, Paper, TextField} from '@mui/material';
import axios from 'axios';
import {useState} from 'react';
import {fromAddress, setKey} from 'react-geocode';
import config from '../config.json';
import {MapPosition} from '../types';

const UserPromptInput = ({
    setSelectedPosition,
    setMinRating,
    setMaxAttractions,
    setMaxDistance,
    setMaxPrice,
    onSearchRoute,
    setTransportMode,
}: {
    setSelectedPosition: (value: MapPosition | null) => void;
    setMinRating: (value: number) => void;
    setMaxAttractions: (value: number) => void;
    setMaxDistance: (value: number) => void;
    setMaxPrice: (value: number) => void;
    onSearchRoute: () => void;
    setTransportMode: (mode: google.maps.TravelMode) => void;
}) => {
    const [input, setInput] = useState('');

    useState(() => {
        setKey(config.REACT_APP_GOOGLE_MAPS_API_KEY);
    });

    const handleSubmit = async () => {
        const response = await axios.get(
            `${config.SERVER_URL}/api/path/prompt`,
            {
                params: {prompt: input},
                headers: {
                    Authorization: localStorage.getItem('token') || '',
                },
            },
        );
        if (response.status === 200) {
            fromAddress(response.data.address).then(({results}) => {
                const {lat, lng} = results[0].geometry.location;
                setSelectedPosition({lat, lng});
            });
            setMaxAttractions(response.data.attractions);
            setTransportMode(response.data.transport);
            setMaxDistance(response.data.distance);
            // rating not exist: setMinRating(response.data.min_rating);
            setMinRating(0);
            // i need to also implement the logic for price: setMaxPrice(response.data.max_price);
            setMaxPrice(200);
            // i get time but i dont use it: setMaxTime(response.data.time);
        } else {
            console.error('Error:', response.statusText);
        }
        setInput('');
        onSearchRoute();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: 10, // above the bottom button
                left: '50%',
                transform: 'translateX(-50%)',
                width: '70%',
                zIndex: 10,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingX: 2,
                    paddingY: 1,
                    bgcolor: '#2f2f2f',
                    border: '1px solid #ad9267',
                    borderRadius: '24px',
                }}
            >
                <TextField
                    placeholder='Describe your trip...'
                    fullWidth
                    multiline
                    maxRows={3}
                    variant='standard'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    InputProps={{
                        disableUnderline: true,
                        style: {
                            color: '#d4b699',
                        },
                    }}
                    sx={{
                        marginRight: 1,
                    }}
                />
                <IconButton onClick={handleSubmit} color='primary'>
                    <Send />
                </IconButton>
            </Paper>
        </Box>
    );
};

export default UserPromptInput;
