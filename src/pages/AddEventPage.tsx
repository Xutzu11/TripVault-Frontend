import {
    Box,
    Button,
    Container,
    CssBaseline,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Footer from '../components/Footer';
import TopNavBar from '../components/TopNavBar';
import config from '../config.json';

const AddEventPage = () => {
    const nav = useNavigate();
    const [attractions, setAttractions] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        startDate: dayjs(),
        endDate: dayjs(),
        attractionId: 0,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return nav('/');

        axios
            .get(`${config.SERVER_URL}/api/access/admin`, {
                headers: {Authorization: token},
            })
            .catch(() => {
                localStorage.removeItem('token');
                nav('/');
            });
    }, []);

    useEffect(() => {
        axios
            .get(`${config.SERVER_URL}/api/attractions`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            })
            .then((res) => setAttractions(res.data));
    }, []);

    const handleChange = (e: any) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const toMySQLDate = (date: Date) => date.toISOString().split('T')[0];

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || formData.attractionId === 0) {
            alert('Please fill all required fields.');
            return;
        }
        try {
            console.log('Form data before submission:', formData);
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price.toString());
            data.append('startDate', toMySQLDate(formData.startDate.toDate()));
            data.append('endDate', toMySQLDate(formData.endDate.toDate()));
            data.append('attractionId', formData.attractionId.toString());
            console.log('Final form data:', data);
            await axios.post(`${config.SERVER_URL}/api/event/add`, data, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Event added!');
            nav('/events');
        } catch (err) {
            alert('Failed to add event.');
            console.error(err);
        }
    };

    return (
        <>
            <CssBaseline />
            <TopNavBar />
            <Box
                sx={{
                    padding: 2,
                    background:
                        'linear-gradient(to right bottom, #1f1f1f, #2a2a2a)',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
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
                            Add Event
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
                            label='Description'
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={3}
                        />
                        <TextField
                            fullWidth
                            required
                            margin='normal'
                            label='Price ($)'
                            name='price'
                            type='number'
                            value={formData.price}
                            onChange={handleChange}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label='Start Date'
                                value={formData.startDate}
                                onChange={(newVal) =>
                                    setFormData({
                                        ...formData,
                                        startDate: newVal || dayjs(),
                                    })
                                }
                                sx={{mt: 2, width: '100%'}}
                            />
                            <DatePicker
                                label='End Date'
                                value={formData.endDate}
                                onChange={(newVal) =>
                                    setFormData({
                                        ...formData,
                                        endDate: newVal || dayjs(),
                                    })
                                }
                                sx={{mt: 2, width: '100%'}}
                            />
                        </LocalizationProvider>

                        <TextField
                            select
                            required
                            label='Attraction'
                            name='attractionId'
                            value={formData.attractionId}
                            onChange={handleChange}
                            fullWidth
                            margin='normal'
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        style: {
                                            maxHeight: 200,
                                        },
                                    },
                                },
                            }}
                        >
                            {attractions.map((a) => (
                                <MenuItem key={a.id} value={a.id}>
                                    {a.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button
                            fullWidth
                            variant='contained'
                            sx={{
                                mt: 3,
                                backgroundColor: '#ad9267',
                                color: '#393939',
                                '&:hover': {backgroundColor: '#d4b699'},
                            }}
                            onClick={handleSubmit}
                        >
                            Add
                        </Button>
                    </Box>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default AddEventPage;
