import {
    Box,
    Button,
    Container,
    Grid,
    MenuItem,
    Rating,
    Slider,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import config from '../config.json';
import MapSelector from './MapSelector';

interface Props {
    formData: {
        name: string;
        theme: string;
        revenue: number;
        rating: number;
        state: number;
        city_id: number;
        photo: null | File;
    };
    setFormData: (data: {
        name: string;
        theme: string;
        revenue: number;
        rating: number;
        state: number;
        city_id: number;
        photo: null | File;
    }) => void;
    position: {lat: number; lng: number};
    setPosition: (position: {lat: number; lng: number}) => void;
    handleSubmit: () => void;
    typeLabel: string;
}

const AttractionForm = ({
    formData,
    setFormData,
    position,
    setPosition,
    handleSubmit,
    typeLabel,
}: Props) => {
    const nav = useNavigate();

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const handleChange = (e: any) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handlePhotoChange = (e: any) => {
        setFormData({...formData, photo: e.target.files[0]});
    };

    useEffect(() => {
        axios
            .get(`${config.SERVER_URL}/api/states`, {
                headers: {Authorization: localStorage.getItem('token')},
            })
            .then((res) => setStates(res.data));
    }, []);

    useEffect(() => {
        if (formData.state) {
            axios
                .get(`${config.SERVER_URL}/api/cities`, {
                    params: {state: formData.state},
                    headers: {Authorization: localStorage.getItem('token')},
                })
                .then((res) => setCities(res.data));
        } else {
            setCities([]);
        }
    }, [formData.state]);

    return (
        <>
            <Container maxWidth='sm'>
                <Box
                    sx={{
                        backgroundColor: '#2f2f2f',
                        borderRadius: 2,
                        padding: 4,
                        boxShadow: 3,
                        mt: 4,
                    }}
                >
                    <Typography
                        variant='h4'
                        gutterBottom
                        sx={{color: '#d4b699'}}
                    >
                        {typeLabel} Attraction
                    </Typography>

                    <TextField
                        fullWidth
                        required
                        margin='normal'
                        label='Name'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin='normal'
                        label='Theme'
                        name='theme'
                        value={formData.theme}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin='normal'
                        label='Revenue'
                        name='revenue'
                        type='number'
                        value={formData.revenue}
                        onChange={handleChange}
                    />
                    <Box mt={2}>
                        <Stack
                            direction='row'
                            spacing={1}
                            alignItems='center'
                            mt={2}
                        >
                            <Typography sx={{color: '#d4b699'}}>
                                Rating:
                            </Typography>
                            <Rating
                                value={formData.rating}
                                precision={0.1}
                                readOnly
                                size='medium'
                            />
                        </Stack>

                        <Slider
                            value={formData.rating}
                            step={0.1}
                            min={1}
                            max={5}
                            onChange={(_, val) =>
                                setFormData({
                                    ...formData,
                                    rating: val as number,
                                })
                            }
                            valueLabelDisplay='auto'
                        />
                    </Box>
                    <Box mb={3}>
                        <MapSelector
                            position={position}
                            setPosition={setPosition}
                        />
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label='Latitude'
                                required
                                fullWidth
                                value={position?.lat ?? ''}
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label='Longitude'
                                required
                                fullWidth
                                value={position?.lng ?? ''}
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        select
                        required
                        fullWidth
                        margin='normal'
                        label='State'
                        name='state'
                        value={formData.state}
                        onChange={handleChange}
                    >
                        {states.map((state: any) => (
                            <MenuItem key={state.id} value={state.id}>
                                {state.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        required
                        fullWidth
                        margin='normal'
                        label='City'
                        name='city_id'
                        value={formData.city_id}
                        onChange={handleChange}
                    >
                        {cities.map((city: any) => (
                            <MenuItem key={city.id} value={city.id}>
                                {city.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box mt={2}>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handlePhotoChange}
                        />
                    </Box>

                    <Stack direction='row' spacing={2} mt={3}>
                        <Button
                            variant='contained'
                            sx={{
                                flex: 5,
                                backgroundColor: '#ad9267',
                                color: '#393939',
                                '&:hover': {backgroundColor: '#d4b699'},
                            }}
                            onClick={handleSubmit}
                        >
                            {typeLabel}
                        </Button>
                        <Button
                            variant='contained'
                            color='inherit'
                            sx={{
                                flex: 1,
                                backgroundColor: '#8B0000',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#a30000',
                                },
                            }}
                            onClick={() => nav('/')}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </>
    );
};

export default AttractionForm;
