import {Box, CssBaseline} from '@mui/material';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import AttractionForm from '../components/AttractionForm';
import Footer from '../components/Footer';
import TopNavBar from '../components/TopNavBar';
import config from '../config.json';
import {AttractionFormData, MapPosition} from '../types';

const EditAttractionPage = () => {
    const nav = useNavigate();
    const {attractionID} = useParams();

    const [position, setPosition] = useState<MapPosition>({
        lat: 45.9432,
        lng: 24.9668,
    });

    const [formData, setFormData] = useState<AttractionFormData>({
        name: '',
        theme: '',
        revenue: 0,
        rating: 3,
        state: 0,
        city_id: 0,
        photo: null,
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
        if (!attractionID) return;
        axios
            .get(`${config.SERVER_URL}/api/attraction/${attractionID}`, {
                headers: {Authorization: localStorage.getItem('token')},
            })
            .then((res) => {
                console.log(res.data);
                setFormData({
                    name: res.data.name,
                    theme: res.data.theme,
                    revenue: parseInt(res.data.revenue),
                    rating: parseFloat(res.data.rating),
                    state: parseInt(res.data.state),
                    city_id: parseInt(res.data.city_id),
                    photo: null,
                });
                setPosition({
                    lat: parseFloat(res.data.latitude),
                    lng: parseFloat(res.data.longitude),
                });
            })
            .catch((err) => console.error(err));
    }, []);

    const handleSubmit = async () => {
        if (!formData.name || formData.city_id === 0) {
            alert('Please fill in all required fields.');
            return;
        }
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('theme', formData.theme);
            data.append('revenue', formData.revenue.toString());
            data.append('rating', formData.rating.toString());
            data.append('city_id', formData.city_id.toString());
            data.append('latitude', position.lat.toString());
            data.append('longitude', position.lng.toString());
            data.append('photo', formData.photo as Blob);

            await axios.put(
                `${config.SERVER_URL}/api/attraction/edit/${attractionID}`,
                data,
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            alert('Attraction updated!');
            nav('/attractions');
        } catch (err) {
            alert('Failed to edit attraction.');
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
                <AttractionForm
                    formData={formData}
                    setFormData={setFormData}
                    position={position}
                    setPosition={setPosition}
                    handleSubmit={handleSubmit}
                    typeLabel='Edit'
                />
            </Box>
            <Footer />
        </>
    );
};

export default EditAttractionPage;
