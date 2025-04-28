import {Box, CssBaseline} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import EventForm from '../components/EventForm';
import Footer from '../components/Footer';
import TopNavBar from '../components/TopNavBar';
import config from '../config.json';
import {Attraction, EventFormData} from '../types';

const AddEventPage = () => {
    const nav = useNavigate();
    const [attractions, setAttractions] = useState<any[]>([]);
    const [formData, setFormData] = useState<EventFormData>({
        name: '',
        description: '',
        price: 0,
        startDate: dayjs(),
        endDate: dayjs(),
        attractionId: '',
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
            .then((res) =>
                setAttractions(
                    res.data.map(
                        (attraction: any) => new Attraction(attraction),
                    ),
                ),
            );
    }, []);

    const toMySQLDate = (date: Date) => date.toISOString().split('T')[0];

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || formData.attractionId === '') {
            alert('Please fill all required fields.');
            return;
        }
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price.toString());
            data.append('startDate', toMySQLDate(formData.startDate.toDate()));
            data.append('endDate', toMySQLDate(formData.endDate.toDate()));
            data.append('attractionId', formData.attractionId.toString());
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
                <EventForm
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    attractions={attractions}
                    typeLabel='Add'
                />
            </Box>
            <Footer />
        </>
    );
};

export default AddEventPage;
