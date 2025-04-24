import {Box, CssBaseline} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import EventForm from '../components/EventForm';
import Footer from '../components/Footer';
import TopNavBar from '../components/TopNavBar';
import config from '../config.json';

const EditEventPage = () => {
    const nav = useNavigate();
    const {eventId} = useParams();
    const [attractions, setAttractions] = useState<any[]>([]);
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        price: number;
        startDate: dayjs.Dayjs;
        endDate: dayjs.Dayjs;
        attractionId: number;
    }>({
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

    useEffect(() => {
        axios
            .get(`${config.SERVER_URL}/api/event/${eventId}`, {
                headers: {Authorization: localStorage.getItem('token')},
            })
            .then((res) => {
                setFormData({
                    name: res.data.name,
                    description: res.data.description,
                    price: res.data.price,
                    startDate: dayjs(res.data.start_date),
                    endDate: dayjs(res.data.end_date),
                    attractionId: res.data.attraction_id,
                });
            })
            .catch((err) => console.error(err));
    }, []);

    const toMySQLDate = (date: Date) => date.toISOString().split('T')[0];

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || formData.attractionId === 0) {
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
            await axios.put(
                `${config.SERVER_URL}/api/event/edit/${eventId}`,
                data,
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            alert('Event updated!');
            nav('/events');
        } catch (err) {
            alert('Failed to update event.');
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
                    typeLabel='Edit'
                />
            </Box>
            <Footer />
        </>
    );
};

export default EditEventPage;
